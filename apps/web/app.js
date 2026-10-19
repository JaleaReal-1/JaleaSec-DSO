import { revealSections } from './lib/reveal.js';
import { solutions, offers, filterSolutions } from './data/catalog.js';
import { customSoftwareOffer, formatSoles, founders5, foundersMessage } from './data/commercial.js';
import { whatsappUrl } from './data/contact.js';
import { requestMessage } from './lib/request.js';
const header = document.querySelector('.header');
if (header && founders5.active) {
  const promotionBar = document.createElement('aside');
  promotionBar.className = 'promotion-bar';
  promotionBar.setAttribute('aria-label', 'Promoción JaleaSec Founders 5');
  const isHome = location.pathname.endsWith('/') || location.pathname.endsWith('/index.html');
  const availability = Number.isInteger(founders5.availableSpots)
    ? `<strong>${founders5.availableSpots} cupos disponibles</strong><span aria-hidden="true">·</span>`
    : '';
  promotionBar.innerHTML = `<a href="${isHome ? '#founders-promotion' : './#founders-promotion'}"><span class="promotion-label">FOUNDERS 5</span><span aria-hidden="true">·</span><strong>${founders5.discount} % de descuento</strong><span aria-hidden="true">·</span><span class="promotion-detail">Promoción limitada a ${founders5.projectLimit} proyectos web</span><span aria-hidden="true">·</span>${availability}<span class="promotion-action">Ver paquetes ↗</span></a>`;
  header.prepend(promotionBar);
}
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
const offerRoot = document.querySelector('#initial-offers');
if (offerRoot) {
  for (const offer of offers.filter(
    (o) => !offerRoot.dataset.segment || o.segment === offerRoot.dataset.segment,
  )) {
    const card = document.createElement('article');
    card.className = 'service';
    const price = founders5.active
      ? `<span class="price-stack"><small>Precio normal <s>${formatSoles(offer.price)}</s></small><strong>${formatSoles(offer.promotionalPrice)}</strong><small>Founders 5 · ${founders5.discount} % de descuento</small></span>`
      : `<span class="price-stack"><strong>${formatSoles(offer.price)}</strong></span>`;
    const cta = founders5.active
      ? `<a class="button founders-whatsapp" href="${whatsappUrl(foundersMessage(offer.name))}" target="_blank" rel="noopener">Quiero acceder a Founders 5 ↗</a>`
      : `<a class="button" href="./?solution=${offer.id}#solicitud">Consultar paquete ↗</a>`;
    card.innerHTML = `<p class="eyebrow">PAQUETE WEB · ${offer.segment}</p><h3>${offer.name}</h3><p>${offer.description}</p><div class="service-footer">${price}</div>${cta}`;
    offerRoot.append(card);
  }
}
document.querySelectorAll('[data-custom-software-price]').forEach((el) => {
  el.textContent = customSoftwareOffer.price;
});
document.querySelectorAll('[data-founders-only]').forEach((el) => {
  el.hidden = !founders5.active;
});
document.querySelectorAll('[data-standard-only]').forEach((el) => {
  el.hidden = founders5.active;
});

const promotionRoot = document.querySelector('#founders-promotion');
if (promotionRoot) {
  promotionRoot.hidden = !founders5.active;
  if (founders5.active) {
    const availability = promotionRoot.querySelector('[data-founders-availability]');
    if (availability && Number.isInteger(founders5.availableSpots)) {
      availability.textContent = `${founders5.availableSpots} de ${founders5.projectLimit} cupos disponibles`;
      availability.hidden = false;
    }
    const packagesRoot = promotionRoot.querySelector('[data-founders-packages]');
    for (const offer of offers) {
      const card = document.createElement('article');
      card.className = 'founders-card';
      card.innerHTML = `<p class="eyebrow">${offer.segment}</p><h3>${offer.name}</h3><p>${offer.description}</p><div class="founders-price"><s>${formatSoles(offer.price)}</s><strong>${formatSoles(offer.promotionalPrice)}</strong></div><a class="button founders-whatsapp" href="${whatsappUrl(foundersMessage(offer.name))}" target="_blank" rel="noopener">Quiero acceder a Founders 5 ↗</a>`;
      packagesRoot.append(card);
    }
    const termsRoot = promotionRoot.querySelector('[data-founders-terms]');
    for (const term of founders5.terms) {
      const item = document.createElement('li');
      item.textContent = term;
      termsRoot.append(item);
    }
  }
}
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
document.querySelectorAll('[data-platform]').forEach((a) =>
  a.addEventListener('click', () => {
    if (platform) platform.value = a.dataset.platform;
    if (select)
      select.value =
        a.dataset.platform === 'App Android'
          ? 'Campus Planner'
          : a.dataset.platform === 'Ambas'
            ? 'Desarrollo personalizado'
            : 'Web para tu negocio';
  }),
);
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

revealSections();
