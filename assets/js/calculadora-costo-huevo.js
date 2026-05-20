const PRESENTACIONES = [
  { nombre: 'Unidad',       unidades: 1  },
  { nombre: 'Media docena', unidades: 6  },
  { nombre: 'Docena',       unidades: 12 },
  { nombre: 'Bandeja 20',   unidades: 20 },
  { nombre: 'Bandeja 30',   unidades: 30 },
];

function g(id) {
  var e = document.getElementById(id);
  return e ? (parseFloat(e.value) || 0) : 0;
}
function s(id) {
  var e = document.getElementById(id);
  return e ? e.value : '';
}

function calcular() {
  var mon = s('moneda');
  var nHuevos = g('n-huevos');
  if (nHuevos <= 0) { alert('Ingresa los huevos producidos ese mes.'); return; }

  // Costos fijos
  var cFijos = g('c-mdo') + g('c-arriendo') + g('c-luz') + g('c-agua') +
               g('c-internet') + g('c-seguros') + g('c-fijos-otros');

  // Alimento
  var cAlimento = g('kg-alimento') * g('p-alimento');

  // Variables
  var cVariables = cAlimento + g('c-med') + g('c-vac') + g('c-desinf') +
                   g('c-empaques') + g('c-transporte') + g('c-limpieza') +
                   g('c-cama') + g('c-var-otros');

  // Reposición
  var cReposicion = g('n-muertas') * g('p-reposicion') + g('c-desgaste');

  var cTotal = cFijos + cVariables + cReposicion;
  var costoPorHuevo = cTotal / nHuevos;
  var pVenta = g('p-venta');
  var margen = pVenta - costoPorHuevo;
  var margenPct = pVenta > 0 ? (margen / pVenta * 100) : 0;

  function fmt(n, dec) {
    dec = dec === undefined ? 2 : dec;
    return mon + ' ' + n.toFixed(dec);
  }
  function fmtN(n) { return Math.round(n).toLocaleString('es-CL'); }

  // KPI principal
  document.getElementById('r-costo-huevo').textContent = fmt(costoPorHuevo);
  document.getElementById('r-costo-unit').textContent = 'costo real por huevo · ' + fmtN(nHuevos) + ' huevos producidos';

  // Precio vs costo
  document.getElementById('r-precio-venta').textContent = fmt(pVenta);
  var margenColor = margen >= 0 ? 'var(--verde-claro)' : 'var(--rojo)';
  document.getElementById('r-margen-val').style.color = margenColor;
  document.getElementById('r-margen-val').textContent = fmt(margen) + ' (' + margenPct.toFixed(1) + '%)';
  document.getElementById('r-margen-txt').textContent = margen >= 0
    ? 'Tu operación genera margen positivo este mes.'
    : '⚠ Tu precio de venta no cubre el costo de producción.';
  document.getElementById('r-margen-txt').style.color = margen >= 0 ? 'var(--verde-claro)' : 'var(--rojo)';
  document.getElementById('r-precio-card').style.borderColor = margen >= 0 ? 'var(--verde-claro)' : 'var(--rojo)';

  // Punto de equilibrio
  document.getElementById('r-equilibrio').textContent = fmt(costoPorHuevo);
  var diff = pVenta - costoPorHuevo;
  var diffAbs = Math.abs(diff * nHuevos);
  document.getElementById('r-equilibrio-desc').textContent = pVenta >= costoPorHuevo
    ? 'Tu precio de venta supera el costo en ' + fmt(diff) + ' por huevo. Al mes eso representa ' + mon + ' ' + Math.round(diff * nHuevos).toLocaleString('es-CL') + ' de margen bruto.'
    : 'Tu precio de venta está ' + fmt(Math.abs(diff)) + ' por debajo del costo. Estás perdiendo ' + mon + ' ' + Math.round(diffAbs).toLocaleString('es-CL') + ' este mes.';

  // Presentaciones
  document.getElementById('r-presentaciones').innerHTML = PRESENTACIONES.map(function(p) {
    var costo = costoPorHuevo * p.unidades;
    return '<div class="pres-card">' +
      '<div class="pres-nombre">' + p.nombre + '</div>' +
      '<div class="pres-costo">' + fmt(costo, 2) + '</div>' +
      '<div class="pres-unidades">' + p.unidades + ' huevo' + (p.unidades > 1 ? 's' : '') + '</div>' +
    '</div>';
  }).join('');

  // Márgenes por presentación
  document.getElementById('r-margenes').innerHTML =
    '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.83rem;">' +
    '<tr style="background:var(--verde);color:#fff;">' +
    '<th style="padding:8px 10px;text-align:left;">Presentación</th>' +
    '<th style="padding:8px 10px;text-align:right;">Costo</th>' +
    '<th style="padding:8px 10px;text-align:right;">Precio venta</th>' +
    '<th style="padding:8px 10px;text-align:right;">Margen</th>' +
    '<th style="padding:8px 10px;text-align:right;">Margen %</th>' +
    '</tr>' +
    PRESENTACIONES.map(function(p, i) {
      var costo = costoPorHuevo * p.unidades;
      var pventa = pVenta * p.unidades;
      var mg = pventa - costo;
      var mgPct = pventa > 0 ? (mg / pventa * 100) : 0;
      var bg = i % 2 === 0 ? '' : 'background:var(--verde-bg);';
      var mgClass = mg >= 0 ? 'color:var(--verde-claro);font-weight:600;' : 'color:var(--rojo);font-weight:600;';
      return '<tr style="' + bg + '">' +
        '<td style="padding:8px 10px;">' + p.nombre + '</td>' +
        '<td style="padding:8px 10px;text-align:right;">' + fmt(costo, 2) + '</td>' +
        '<td style="padding:8px 10px;text-align:right;">' + fmt(pventa, 2) + '</td>' +
        '<td style="padding:8px 10px;text-align:right;' + mgClass + '">' + fmt(mg, 2) + '</td>' +
        '<td style="padding:8px 10px;text-align:right;' + mgClass + '">' + mgPct.toFixed(1) + '%</td>' +
      '</tr>';
    }).join('') +
    '</table></div>';

  // Desglose
  var partidas = [
    { nombre: 'Mano de obra',             valor: g('c-mdo'),         cat: 'Fijos' },
    { nombre: 'Arriendo / amortización',  valor: g('c-arriendo'),    cat: 'Fijos' },
    { nombre: 'Electricidad',             valor: g('c-luz'),         cat: 'Fijos' },
    { nombre: 'Agua',                     valor: g('c-agua'),        cat: 'Fijos' },
    { nombre: 'Internet / telefonía',     valor: g('c-internet'),    cat: 'Fijos' },
    { nombre: 'Seguros',                  valor: g('c-seguros'),     cat: 'Fijos' },
    { nombre: 'Otros fijos',              valor: g('c-fijos-otros'), cat: 'Fijos' },
    { nombre: 'Alimento',                 valor: cAlimento,          cat: 'Variables' },
    { nombre: 'Medicamentos',             valor: g('c-med'),         cat: 'Variables' },
    { nombre: 'Vacunas',                  valor: g('c-vac'),         cat: 'Variables' },
    { nombre: 'Desinfectantes',           valor: g('c-desinf'),      cat: 'Variables' },
    { nombre: 'Empaques / cartones',      valor: g('c-empaques'),    cat: 'Variables' },
    { nombre: 'Transporte',               valor: g('c-transporte'),  cat: 'Variables' },
    { nombre: 'Materiales de limpieza',   valor: g('c-limpieza'),    cat: 'Variables' },
    { nombre: 'Cama / sustrato',          valor: g('c-cama'),        cat: 'Variables' },
    { nombre: 'Otros variables',          valor: g('c-var-otros'),   cat: 'Variables' },
    { nombre: 'Reposición de aves',       valor: g('n-muertas') * g('p-reposicion'), cat: 'Reposición' },
    { nombre: 'Desgaste equipamiento',    valor: g('c-desgaste'),    cat: 'Reposición' },
  ].filter(function(p) { return p.valor > 0; });

  var html = '<tr><th>Partida</th><th style="text-align:right;">Monto</th><th style="text-align:right;">% del total</th><th style="text-align:right;">Costo/huevo</th></tr>';
  var catActual = '';
  partidas.forEach(function(p) {
    if (p.cat !== catActual) {
      catActual = p.cat;
      html += '<tr><td colspan="4" style="background:var(--crema);font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--texto-sec);padding:6px 10px;">' + p.cat + '</td></tr>';
    }
    var pct = cTotal > 0 ? (p.valor / cTotal * 100).toFixed(1) : '0.0';
    var ch = (p.valor / nHuevos).toFixed(2);
    html += '<tr><td style="padding:8px 10px;">' + p.nombre + '</td>' +
      '<td style="padding:8px 10px;text-align:right;">' + mon + ' ' + p.valor.toLocaleString('es-CL', {minimumFractionDigits:2, maximumFractionDigits:2}) + '</td>' +
      '<td style="padding:8px 10px;text-align:right;color:var(--texto-sec);">' + pct + '%</td>' +
      '<td style="padding:8px 10px;text-align:right;">' + mon + ' ' + ch + '</td></tr>';
  });
  html += '<tr class="td-total"><td style="padding:8px 10px;font-weight:700;background:var(--crema);">TOTAL</td>' +
    '<td style="padding:8px 10px;text-align:right;font-weight:700;background:var(--crema);">' + mon + ' ' + cTotal.toLocaleString('es-CL', {minimumFractionDigits:2, maximumFractionDigits:2}) + '</td>' +
    '<td style="padding:8px 10px;background:var(--crema);"></td>' +
    '<td style="padding:8px 10px;text-align:right;font-weight:700;background:var(--crema);">' + fmt(costoPorHuevo) + '</td></tr>';

  document.getElementById('r-desglose').innerHTML = html;

  document.getElementById('resultados').style.display = 'block';
  document.getElementById('resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function irAviManager() {
  alert('Enlace a AviManager — reemplaza esta función con tu URL real.');
}



  (function () {
    const toggle = document.querySelector('.menu-toggle, .ag-menu-toggle');
    const menu = document.querySelector('.nav-links, .ag-links');

    if (!toggle || !menu) return;

    function closeMenu() {
      toggle.classList.remove('is-open');
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        closeMenu();
      }
    });
  })();
