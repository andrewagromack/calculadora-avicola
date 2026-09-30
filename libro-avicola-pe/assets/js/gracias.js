// ============================================================
// Página de gracias: mide la compra.
//
// META_PURCHASE_EVENT define cómo se envía a Meta:
//   'CompraConfirmada'  -> evento propio (mientras Hotmart siga enviando
//                          su propio Purchase; así no se cuenta doble)
//   'Purchase'          -> evento estándar (cambiar SOLO después de
//                          desactivar el Purchase en Hotmart y de
//                          comprobar con una compra de prueba que esta
//                          página se dispara una vez)
//
// El plan viaja en la URL de retorno que se configura en cada oferta
// de Hotmart:  gracias.html?plan=mensual  |  gracias.html?plan=anual
// ============================================================
(function () {
  const META_PURCHASE_EVENT = 'CompraConfirmada';

  // Precios de cada plan. Mantener igual que las tarjetas de index.html.
  const PLANES = {
    mensual: { nombre: 'Plan mensual', value: 31, currency: 'PEN' },
    anual:   { nombre: 'Plan anual',   value: 262, currency: 'PEN' },
  };

  const params = new URLSearchParams(location.search);
  const planKey = (params.get('plan') || '').toLowerCase();
  const plan = PLANES[planKey] || null;

  // Texto visible con el plan
  const planEl = document.getElementById('thanksPlan');
  if (planEl && plan) {
    planEl.textContent = plan.nombre;
    planEl.hidden = false;
  }

  // Seguro contra recargas: no repetir el evento en el mismo navegador
  // durante 24 horas.
  const KEY = 'avm_compra_ts';
  const now = Date.now();
  try {
    const last = Number(localStorage.getItem(KEY));
    if (last && now - last < 24 * 60 * 60 * 1000) return;
    localStorage.setItem(KEY, String(now));
  } catch (e) { /* sin almacenamiento: se envía igual */ }

  const money = plan ? { value: plan.value, currency: plan.currency } : {};
  const nombre = plan ? plan.nombre : 'Plan sin identificar';

  if (typeof window.fbq === 'function') {
    const data = { ...money, content_name: nombre, content_type: 'product' };
    if (META_PURCHASE_EVENT === 'Purchase') window.fbq('track', 'Purchase', data);
    else window.fbq('trackCustom', META_PURCHASE_EVENT, data);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      ...money,
      items: [{ item_id: planKey || 'desconocido', item_name: nombre }],
    });
  }
})();
