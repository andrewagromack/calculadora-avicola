// ============================================================
// Demo interactivo: navegación entre pantallas de ejemplo.
// Cliente puro: sin backend, sin datos reales.
// ============================================================
(function () {
  const tabs = [...document.querySelectorAll('.demo-nav-item.is-live')];
  const panels = [...document.querySelectorAll('.demo-panel')];
  const toast = document.getElementById('demoToast');
  if (!tabs.length || !panels.length) return;

  const track = (name, params) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  };

  const show = (screen, opts = {}) => {
    const target = panels.find((p) => p.dataset.screen === screen);
    if (!target) return;
    panels.forEach((p) => { p.hidden = p !== target; });
    tabs.forEach((t) => {
      const on = t.dataset.screen === screen;
      t.classList.toggle('is-current', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      if (on) t.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
    if (toast) toast.hidden = true;
    if (opts.track !== false) track('demo_screen', { screen });
    if (opts.focus) target.querySelector('h2')?.setAttribute('tabindex', '-1'), target.querySelector('h2')?.focus({ preventScroll: true });
  };

  tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.screen)));

  document.querySelectorAll('[data-next]').forEach((b) => {
    b.addEventListener('click', () => {
      show(b.dataset.next, { focus: true });
      document.querySelector('.demo-app').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('[data-demo-cta]').forEach((a) => {
    a.addEventListener('click', () => track('demo_cta', { destino: a.dataset.demoCta }));
  });

  let toastTimer;
  document.querySelectorAll('[data-locked]').forEach((b) => {
    b.addEventListener('click', () => {
      if (!toast) return;
      toast.textContent = `"${b.textContent.trim()}" solo está en la app completa. Esto es una demo.`;
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
    });
  });

  const fromHash = () => location.hash.replace('#', '');
  const valid = (h) => panels.some((p) => p.dataset.screen === h);
  show(valid(fromHash()) ? fromHash() : 'registro', { track: false });
  window.addEventListener('hashchange', () => { if (valid(fromHash())) show(fromHash(), { track: false }); });
})();
