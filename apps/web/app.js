import { setupMotion } from './lib/motion.js';
import { solutions, offers, filterSolutions } from './data/catalog.js';
import { webOffer } from './data/commercial.js';
import { whatsappUrl } from './data/contact.js';
import { requestMessage } from './lib/request.js';
const header = document.querySelector('.header');
const menu = document.querySelector('.menu-toggle');
if (menu) header?.classList.add('menu-ready');
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  document.querySelector('#navigation')?.classList.toggle('open', expanded);
});
document.querySelectorAll('#navigation a').forEach((link) =>
  link.addEventListener('click', () => {
    menu?.setAttribute('aria-expanded', 'false');
    document.querySelector('#navigation')?.classList.remove('open');
  }),
);
document.querySelectorAll('.whatsapp-link').forEach((link) => {
  link.href = whatsappUrl(
    link.dataset.message || 'Hola, JaleaSec. Me gustaría conversar sobre un proyecto de software.',
  );
  link.target = '_blank';
  link.rel = 'noopener';
});
const catalog = document.querySelector('#catalog');
function renderCatalog(filter = 'Destacadas') {
  const visibleSolutions = filterSolutions(filter);
  catalog.replaceChildren(
    ...visibleSolutions.map((s) => {
      const article = document.createElement('article');
      article.className = 'solution-card';
      // Catalog is trusted, versioned editorial data; never inject form input here.
      article.innerHTML = `<span class="solution-icon ${s.color}" aria-hidden="true">${s.icon}</span><span class="solution-category">${s.category}</span><h3>${s.name}</h3><span class="catalog-status">${s.status}</span><p>${s.description}</p><div class="card-meta"><span>${s.price}</span><small>${s.time}</small></div><a class="card-link" href="./solucion.html?id=${s.id}">Ver solución <span aria-hidden="true">↗</span><span class="sr-only"> ${s.name}</span></a>`;
      return article;
    }),
  );
  const status = document.querySelector('#catalog-status');
  if (status) status.textContent = `${visibleSolutions.length} soluciones · ${filter}`;
}
if (catalog) {
  renderCatalog();
  document.querySelectorAll('[data-filter]').forEach((button) =>
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((b) => {
        b.classList.toggle('active', b === button);
        b.setAttribute('aria-pressed', String(b === button));
      });
      renderCatalog(button.dataset.filter);
    }),
  );
}
document.querySelectorAll('[data-starting-price]').forEach((el) => {
  el.textContent = webOffer.label;
});
const select = document.querySelector('#solution-select');
const platform = document.querySelector('#platform-select');
if (select) {
  for (const s of [...offers, ...solutions]) select.add(new Option(s.name, s.name));
  const selected = [...offers, ...solutions].find(
    (s) => s.id === new URLSearchParams(location.search).get('solution'),
  );
  if (selected) {
    select.value = selected.name;
    if (platform)
      platform.value =
        selected.platform || (selected.id === 'custom' ? 'Necesito orientación' : 'App Android');
    const clientType = document.querySelector('[name="clientType"]');
    if (clientType && selected.segment)
      clientType.value = selected.segment === 'Negocios' ? 'Negocio' : 'Universitario';
  }
}
menu?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    menu.setAttribute('aria-expanded', 'false');
    document.querySelector('#navigation')?.classList.remove('open');
  }
});
document.querySelector('#navigation')?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    menu.setAttribute('aria-expanded', 'false');
    document.querySelector('#navigation').classList.remove('open');
    menu.focus();
  }
});
const form = document.querySelector('#request-form');
const date = form?.elements.date;
if (date) {
  const now = new Date();
  date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
// Reveal an optional field if browser validation needs the user's attention.
form?.addEventListener(
  'invalid',
  (event) => {
    const details = event.target.closest('details');
    if (details) details.open = true;
  },
  true,
);
form?.addEventListener('input', () => {
  document.querySelector('#request-result').hidden = true;
  document.querySelector('#copy-status').textContent = '';
});
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const message = requestMessage(Object.fromEntries(new FormData(form)));
  document.querySelector('#message-preview').value = message;
  document.querySelector('#send-whatsapp').href = whatsappUrl(message);
  document.querySelector('#request-result').hidden = false;
  document.querySelector('#request-result').scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'center',
  });
});
document.querySelector('#copy-request')?.addEventListener('click', async () => {
  const preview = document.querySelector('#message-preview');
  try {
    await navigator.clipboard.writeText(preview.value);
    document.querySelector('#copy-status').textContent = 'Mensaje copiado.';
  } catch {
    preview.focus();
    preview.select();
    document.querySelector('#copy-status').textContent =
      'Seleccionamos el mensaje. Usa la opción Copiar de tu dispositivo.';
  }
});
document.querySelector('#year')?.replaceChildren(String(new Date().getFullYear()));

// Enable only after submit interception is ready: without JS, no form data enters a URL.
form?.querySelector('fieldset')?.removeAttribute('disabled');
setupMotion();
