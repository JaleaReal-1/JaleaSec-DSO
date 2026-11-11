import test from 'node:test';
import assert from 'node:assert/strict';
import { setupMotion } from '../apps/web/lib/motion.js';

test('reduced motion removes pinning and transforms, including live preference changes', () => {
  const keys = [
    'window',
    'document',
    'matchMedia',
    'addEventListener',
    'removeEventListener',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'innerHeight',
  ];
  const original = new Map(
    keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]),
  );
  const classes = new Set();
  const properties = new Map();
  const scheduled = [];
  const media = [];
  const stage = {
    offsetHeight: 700,
    style: {
      setProperty: (key, value) => properties.set(key, value),
      removeProperty: (key) => properties.delete(key),
    },
  };
  const track = {
    offsetHeight: 1620,
    getBoundingClientRect: () => ({ top: -200 }),
    querySelector: () => stage,
  };
  try {
    Object.assign(globalThis, {
      window: {},
      document: {
        body: {
          classList: {
            toggle: (name, enabled) => (enabled ? classes.add(name) : classes.delete(name)),
          },
        },
        querySelector: () => track,
        querySelectorAll: () => [],
      },
      matchMedia(query) {
        const result = {
          matches: true,
          addEventListener: (_type, fn) => {
            result.change = fn;
          },
          removeEventListener() {},
        };
        media.push(result);
        return result;
      },
      addEventListener() {},
      removeEventListener() {},
      cancelAnimationFrame() {},
      requestAnimationFrame(fn) {
        scheduled.push(fn);
        return scheduled.length;
      },
      innerHeight: 900,
    });
    setupMotion();
    assert.equal(classes.has('motion-ready'), false);
    assert.equal(scheduled.length, 0);
    assert.equal(properties.size, 0);
    media[0].matches = false;
    media[0].change();
    scheduled.shift()();
    assert.equal(classes.has('motion-ready'), true);
    assert.equal(properties.size, 4);
    media[0].matches = true;
    media[0].change();
    assert.equal(classes.has('motion-ready'), false);
    assert.equal(properties.size, 0);
  } finally {
    for (const [key, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
