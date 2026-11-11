// One scroll clock, a stable reading column, and a complete static composition.
export function storyFrame(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const reveal = Math.min(1, p / 0.72);
  return { rotate: -8 * (1 - reveal), scale: 0.82 + 0.18 * reveal, y: 28 * (1 - reveal) };
}

export function setupMotion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia(
    '(min-width: 1101px) and (min-height: 760px) and (hover: hover) and (pointer: fine)',
  );
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const track = document.querySelector('.story-track');
  const stage = track?.querySelector('.story-stage');
  const surfaces = [...document.querySelectorAll('.hero-art')];
  const decorations = [...document.querySelectorAll('.hero-art, .scene')];
  let frame = 0;
  let active = false;
  function update() {
    frame = 0;
    if (!active || !track || !stage) return;
    const rect = track.getBoundingClientRect();
    const distance = Math.max(1, track.offsetHeight - stage.offsetHeight);
    const progress = Math.max(0, Math.min(1, (106 - rect.top) / distance));
    const state = storyFrame(progress);
    stage.style.setProperty('--story-rotate', `${state.rotate}deg`);
    stage.style.setProperty('--story-scale', state.scale);
    stage.style.setProperty('--story-y', `${state.y}px`);
    stage.style.setProperty('--story-progress', progress);
  }
  function schedule() {
    if (active && !frame) frame = requestAnimationFrame(update);
  }
  function sync() {
    active = !reduce.matches && desktop.matches && Boolean(track);
    document.body.classList.toggle('motion-ready', active);
    if (!active && stage) {
      for (const name of ['--story-rotate', '--story-scale', '--story-y', '--story-progress'])
        stage.style.removeProperty(name);
    }
    surfaces.forEach((el) => {
      el.style.removeProperty('--pointer-x');
      el.style.removeProperty('--pointer-y');
    });
    decorations.forEach((el) => {
      const rect = el.getBoundingClientRect();
      el.classList.toggle(
        'motion-active',
        !reduce.matches && rect.bottom > 0 && rect.top < innerHeight,
      );
    });
    schedule();
  }
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) =>
        target.classList.toggle('motion-active', isIntersecting && !reduce.matches),
      );
    });
    decorations.forEach((el) => observer.observe(el));
  }
  surfaces.forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      if (reduce.matches || !pointer.matches) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty(
        '--pointer-x',
        `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`,
      );
      el.style.setProperty(
        '--pointer-y',
        `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`,
      );
    });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--pointer-x');
      el.style.removeProperty('--pointer-y');
    });
  });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', sync);
  reduce.addEventListener('change', sync);
  desktop.addEventListener('change', sync);
  // BFCache restores retain listeners; only release resources on a real unload.
  addEventListener(
    'pagehide',
    (event) => {
      if (event.persisted) return;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', sync);
      reduce.removeEventListener('change', sync);
      desktop.removeEventListener('change', sync);
    },
    { once: true },
  );
  addEventListener('pageshow', sync);
  sync();
}
