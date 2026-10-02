// ============================================================
// Resume el resultado ya calculado por calculadora-integral-proyecto.js
// en el campo oculto fields[resultado], sin tocar el motor original.
// Se re-lee cada vez que cambia cualquier input del formulario.
// ============================================================
(function () {
  const campoResultado = document.getElementById('field-resultado');
  if (!campoResultado) return;

  function actualizar() {
    const aves = document.getElementById('k-aves')?.textContent || '—';
    const inversion = document.getElementById('k-inversion')?.textContent || '—';
    const moneda = document.getElementById('moneda')?.value || '';
    const modo = document.querySelector('.modo-btn.active')?.dataset.modo || '';
    campoResultado.value = `Proyecto ${modo} | ${aves} aves | Moneda: ${moneda} | Inversión inicial: ${inversion}`;
  }

  document.querySelectorAll('.calculator-stack input, .calculator-stack select').forEach((el) => {
    el.addEventListener('input', () => setTimeout(actualizar, 50));
    el.addEventListener('change', () => setTimeout(actualizar, 50));
  });
  document.querySelectorAll('.modo-btn').forEach((btn) => {
    btn.addEventListener('click', () => setTimeout(actualizar, 50));
  });
  setTimeout(actualizar, 200);
})();
