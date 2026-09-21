// ============================================================
// Menú móvil
// ============================================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cierra el menú al elegir un link (útil en móvil)
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

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
if (header) {
  const onScroll = () => {
    if (window.scrollY > 8) header.style.boxShadow = '0 1px 0 rgba(15,27,64,0.06)';
    else header.style.boxShadow = 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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
  lightboxImg.src = img.dataset.full || img.src;
  lightboxImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
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
