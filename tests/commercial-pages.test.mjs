import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { solutions, offers } from '../apps/web/data/catalog.js';
import { webOffer } from '../apps/web/data/commercial.js';

const webRoot = fileURLToPath(new URL('../apps/web/', import.meta.url));
const pages = [
  'index.html',
  'negocios.html',
  'universitarios.html',
  'proyectos.html',
  'solucion.html',
  'privacidad.html',
];

test('public pages use one starting price, remote positioning and working static contact', async () => {
  for (const page of pages) {
    const html = await readFile(path.join(webRoot, page), 'utf8');
    assert.doesNotMatch(html, /founders|juliaca|promoci[oó]n|descuento/i, page);
    assert.match(html, /Trabajamos de forma remota/, page);
    assert.match(html, /https:\/\/wa\.me\/51938888511\?text=/, page);
    assert.match(html, /<meta\s+name="description"/, page);
    assert.match(html, /<meta\s+property="og:title"/, page);
    for (const price of html.matchAll(/S\/\s*([\d,]+)/g))
      assert.equal(Number(price[1].replaceAll(',', '')), webOffer.startingPrice, page);
    if (['index.html', 'negocios.html', 'universitarios.html'].includes(page)) {
      assert.equal((html.match(/data-starting-price/g) || []).length, 1, page);
      assert.match(html, /Desde S\/ 599/);
    }
  }
  for (const file of ['app.js', 'styles.css', 'data/commercial.js', 'data/contact.js']) {
    assert.doesNotMatch(
      await readFile(path.join(webRoot, file), 'utf8'),
      /founders|juliaca|promotionalPrice/i,
      file,
    );
  }
  const home = await readFile(path.join(webRoot, 'index.html'), 'utf8');
  assert.match(
    home,
    /<fieldset disabled>/,
    'Form must not submit browser data when scripts are unavailable',
  );
  for (const offer of offers) assert.ok(home.includes(offer.description), offer.id);
  const css = await readFile(path.join(webRoot, 'styles.css'), 'utf8');
  for (const [, font] of css.matchAll(/url\(['"]?(\.\/assets\/fonts\/[^'"\)]+)/g))
    await access(path.join(webRoot, font));
});

test('scroll scene remains bounded and holds a readable final frame', async () => {
  const { storyFrame } = await import('../apps/web/lib/motion.js');
  assert.deepEqual(storyFrame(-1), storyFrame(0));
  assert.deepEqual(storyFrame(2), storyFrame(1));
  const start = storyFrame(0),
    middle = storyFrame(0.36),
    end = storyFrame(0.72);
  assert.ok(start.scale < middle.scale && middle.scale < end.scale);
  assert.ok(start.rotate < middle.rotate && middle.rotate < end.rotate);
  assert.deepEqual(end, storyFrame(1));
  assert.equal(end.scale, 1);
  assert.equal(end.y, 0);
});

test('commercial navigation, assets and anchors resolve from root and legacy subdirectory', async () => {
  for (const page of pages) {
    const html = await readFile(path.join(webRoot, page), 'utf8');
    for (const prefix of ['/', '/jaleasec/']) {
      for (const [, relative] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const url = new URL(relative, `https://local.test${prefix}${page}`);
        if (url.origin !== 'https://local.test') continue;
        assert.ok(url.pathname.startsWith(prefix), `${page}: ${relative} escapes ${prefix}`);
        let target = decodeURIComponent(url.pathname.slice(prefix.length));
        if (!target || target.endsWith('/')) target += 'index.html';
        const file =
          target === 'demos/campus-planner/index.html'
            ? fileURLToPath(new URL('../apps/mobile/campus-planner/index.html', import.meta.url))
            : path.join(webRoot, target);
        await access(file);
        if (url.hash) {
          const destination = await readFile(file, 'utf8');
          assert.ok(
            destination.includes(`id="${url.hash.slice(1)}"`),
            `${page}: missing anchor ${relative}`,
          );
        }
        if (url.searchParams.has('id'))
          assert.ok(solutions.some((s) => s.id === url.searchParams.get('id')));
        if (url.searchParams.has('solution'))
          assert.ok(
            [...offers, ...solutions].some((s) => s.id === url.searchParams.get('solution')),
          );
      }
    }
  }
});

// Optional animation must never be a prerequisite for reading the page.
test('reveal enhancement tolerates missing observer and respects reduced motion', async () => {
  const { revealSections } = await import('../apps/web/lib/reveal.js');
  const originalWindow = globalThis.window;
  const originalMatchMedia = globalThis.matchMedia;
  const root = {
    querySelectorAll() {
      throw new Error('Fallback must leave content alone');
    },
  };
  try {
    globalThis.window = {};
    assert.doesNotThrow(() => revealSections(root));
    globalThis.window = {
      IntersectionObserver: class {
        constructor() {
          throw new Error('Motion disabled');
        }
      },
    };
    globalThis.matchMedia = () => ({ matches: true });
    assert.doesNotThrow(() => revealSections(root));
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
    if (originalMatchMedia === undefined) delete globalThis.matchMedia;
    else globalThis.matchMedia = originalMatchMedia;
  }
});
