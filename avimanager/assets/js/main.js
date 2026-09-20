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
// TODO(backend): este formulario NO envía datos a ningún lado
// todavía. Antes de publicar, conectar a uno de:
//   - Un endpoint propio (ej. FastAPI existente o una función
//     serverless en Vercel) que inserte en Supabase.
//   - Un servicio de formularios externo (Formspree, Basin, etc.)
//     cambiando el fetch de abajo por su endpoint.
// Mientras tanto, solo valida y muestra un mensaje de confirmación
// en pantalla; los datos no quedan guardados en ningún lado.
// ============================================================
const accessForm = document.getElementById('accessForm');
const formStatus = document.getElementById('formStatus');

if (accessForm && formStatus) {
  accessForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();

    if (!nombre || !correo) {
      formStatus.classList.remove('is-success');
      formStatus.classList.add('is-error');
      formStatus.textContent = 'Completa nombre y correo para continuar.';
      return;
    }

    // Validación mínima de email
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      formStatus.classList.remove('is-success');
      formStatus.classList.add('is-error');
      formStatus.textContent = 'Revisa que el correo esté bien escrito.';
      return;
    }

    // --- Punto de integración futuro ---
    // fetch('/api/leads', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     nombre,
    //     correo,
    //     pais: document.getElementById('pais')?.value || '',
    //     lotes: document.getElementById('lotes')?.value.trim() || ''
    //   })
    // });

    formStatus.classList.remove('is-error');
    formStatus.classList.add('is-success');
    formStatus.textContent = `¡Listo, ${nombre.split(' ')[0]}! Te escribimos a ${correo} en menos de 24 horas hábiles.`;
    accessForm.reset();
  });
}

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
  lightboxImg.src = img.src;
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
