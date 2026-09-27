// ============================================================
// Menú móvil
// ============================================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  // Fondo oscuro detrás del menú; va en <body> porque el header
  // usa backdrop-filter y atraparía un position:fixed interno.
  const navBackdrop = document.createElement('div');
  navBackdrop.className = 'nav-backdrop';
  document.body.appendChild(navBackdrop);

  const setNav = (open) => {
    mainNav.classList.toggle('open', open);
    navBackdrop.classList.toggle('show', open);
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };

  navToggle.addEventListener('click', () => setNav(!mainNav.classList.contains('open')));
  navBackdrop.addEventListener('click', () => setNav(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('open')) {
      setNav(false);
      navToggle.focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  // Cierra el menú al elegir un link (útil en móvil)
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNav(false));
  });
}

// ============================================================
// Sección activa en el menú (solo links internos "#...")
// ============================================================
if (mainNav && 'IntersectionObserver' in window) {
  const spyLinks = [...mainNav.querySelectorAll('a[href^="#"]:not(.nav-cta)')];
  const spyTargets = spyLinks
    .map((a) => ({ a, el: document.querySelector(a.getAttribute('href')) }))
    .filter((x) => x.el);
  if (spyTargets.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        spyLinks.forEach((a) => a.classList.remove('is-active'));
        const hit = spyTargets.find((x) => x.el === entry.target);
        if (hit) hit.a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyTargets.forEach((x) => spy.observe(x.el));
  }
}

// ============================================================
// Barra CTA móvil: aparece recién cuando los CTA del hero salen
// de pantalla, y se esconde en Precios y en el formulario.
// ============================================================
const mobileCta = document.querySelector('.mobile-cta');
if (mobileCta) {
  const heroActions = document.querySelector('.hero .hero-actions');
  const zones = ['#precios', '#acceso'].map((s) => document.querySelector(s)).filter(Boolean);
  let heroAhead = !!heroActions;
  const inZone = new Set();
  const update = () => {
    const show = !heroAhead && inZone.size === 0;
    mobileCta.classList.toggle('is-visible', show);
    document.body.classList.toggle('cta-visible', show);
  };
  if ('IntersectionObserver' in window) {
    if (heroActions) {
      new IntersectionObserver(([entry]) => {
        heroAhead = entry.isIntersecting || entry.boundingClientRect.top > 0;
        update();
      }).observe(heroActions);
    }
    const zoneObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inZone.add(entry.target);
        else inZone.delete(entry.target);
      });
      update();
    }, { rootMargin: '0px 0px -25% 0px' });
    zones.forEach((z) => zoneObs.observe(z));
  } else {
    heroAhead = false;
  }
  update();
}

// ============================================================
// Video: carga el iframe de YouTube recién al hacer clic
// ============================================================
document.querySelectorAll('.video-facade').forEach((facade) => {
  facade.addEventListener('click', (event) => {
    event.preventDefault();
    const iframe = document.createElement('iframe');
    iframe.src = facade.dataset.embed;
    iframe.title = facade.dataset.title || '';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    iframe.setAttribute('frameborder', '0');
    facade.replaceWith(iframe);
  });
});

// ============================================================
// Año dinámico en footer
// ============================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Formulario de solicitud de acceso
//
// El envío real lo maneja el script de MailerLite (ver el final
// de index.html: webforms.min.js + ml_webform_success_46151553).
// Ese script intercepta el submit, publica en la lista real y
// muestra el div .row-success al terminar. Acá no hay que hacer
// nada más — si se agrega lógica de submit propia, hay que evitar
// un event.preventDefault() incondicional o bloquea el envío real.
// ============================================================

// ============================================================
// Header más denso al hacer scroll
// ============================================================
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
const onScroll = () => {
  if (header) header.style.boxShadow = window.scrollY > 8 ? '0 1px 0 rgba(15,27,64,0.06)' : 'none';
  if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 1200);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}

// ============================================================
// Lightbox: zoom al hacer click en las capturas de producto
// ============================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const zoomButtons = document.querySelectorAll('.shot-zoom, .compare-zoom');

let lastFocusedZoom = null;

function openLightbox(triggerBtn) {
  const img = triggerBtn.querySelector('img');
  if (!img || !lightbox || !lightboxImg) return;

  lastFocusedZoom = triggerBtn;
  // Si la miniatura es un recorte (tiene data-full), el lightbox muestra
  // la imagen completa en vez del recorte.
  lightbox.classList.remove('is-pan');
  lightboxImg.onload = () => {
    const wide = lightboxImg.naturalWidth / lightboxImg.naturalHeight > 1.6;
    if (wide && window.innerWidth < 760) {
      lightbox.classList.add('is-pan');
      lightbox.scrollLeft = 0;
    }
  };
  lightboxImg.src = img.dataset.full || img.src;
  lightboxImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  lightbox.classList.remove('is-pan');
  lightboxImg.onload = null;
  lightboxImg.src = '';
  document.body.style.overflow = '';
  if (lastFocusedZoom) lastFocusedZoom.focus();
}

zoomButtons.forEach((btn) => {
  btn.addEventListener('click', () => openLightbox(btn));
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (lightbox) {
  // Cierra al hacer click fuera de la imagen (en el fondo oscuro)
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
});
