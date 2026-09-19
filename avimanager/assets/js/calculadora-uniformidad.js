// ============================================================
// Calculadora de uniformidad de lote
//
// Metodología estándar de la industria (la misma que usan las guías
// técnicas de las líneas genéticas): uniformidad = % de aves con peso
// dentro de ±10% del promedio de la muestra. CV% = (desviación
// estándar / promedio) × 100. Se usa desviación estándar muestral
// (n-1), porque los pesos ingresados son una muestra del lote, no el
// lote completo.
// ============================================================

const pesosInput = document.getElementById('pesos');
const unidadSelect = document.getElementById('unidad');
const toolEmpty = document.getElementById('toolEmpty');
const toolResults = document.getElementById('toolResults');

function parseWeights(raw) {
  return raw
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => parseFloat(t.replace(',', '.')))
    .filter((v) => Number.isFinite(v) && v > 0);
}

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values, avg) {
  if (values.length < 2) return 0;
  const sumSq = values.reduce((acc, v) => acc + (v - avg) ** 2, 0);
  return Math.sqrt(sumSq / (values.length - 1));
}

function fmt(val, decimals = 1) {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

function badgeFor(unif) {
  if (unif >= 80) return { cls: 'badge-good', txt: 'Buena uniformidad' };
  if (unif >= 70) return { cls: 'badge-warn', txt: 'Revisar manejo' };
  return { cls: 'badge-bad', txt: 'Requiere atención' };
}

function render() {
  const values = parseWeights(pesosInput.value);
  const unidad = unidadSelect.value;

  if (values.length < 2) {
    toolEmpty.style.display = 'block';
    toolResults.style.display = 'none';
    return;
  }

  toolEmpty.style.display = 'none';
  toolResults.style.display = 'block';

  const avg = mean(values);
  const sd = stdDev(values, avg);
  const cv = avg > 0 ? (sd / avg) * 100 : 0;

  const lower = avg * 0.9;
  const upper = avg * 1.1;
  const inRange = values.filter((v) => v >= lower && v <= upper);
  const below = values.filter((v) => v < lower);
  const above = values.filter((v) => v > upper);
  const unif = (inRange.length / values.length) * 100;

  document.getElementById('rN').textContent = values.length;
  document.getElementById('rMean').textContent = fmt(avg, unidad === 'kg' ? 2 : 0);
  document.getElementById('rSD').textContent = fmt(sd, unidad === 'kg' ? 2 : 1);
  document.getElementById('rCV').textContent = fmt(cv, 1);
  document.getElementById('rUnitMean').textContent = unidad;
  document.getElementById('rUnitSD').textContent = unidad;
  document.getElementById('rUnif').innerHTML = `${fmt(unif, 1)}<span>%</span>`;

  const badge = badgeFor(unif);
  const badgeEl = document.getElementById('rBadge');
  badgeEl.className = `uni-badge ${badge.cls}`;
  badgeEl.textContent = badge.txt;

  document.getElementById('rRange').innerHTML =
    `Rango aceptado (±10%): ${fmt(lower, unidad === 'kg' ? 2 : 0)} – ${fmt(upper, unidad === 'kg' ? 2 : 0)} ${unidad}`;

  const outlierParts = [];
  if (below.length) outlierParts.push(`${below.length} por debajo del rango`);
  if (above.length) outlierParts.push(`${above.length} por encima del rango`);
  document.getElementById('rOutliers').textContent = outlierParts.length
    ? `Fuera de rango: ${outlierParts.join(' · ')}`
    : 'Todas las aves de la muestra están dentro del rango.';
}

pesosInput.addEventListener('input', render);
unidadSelect.addEventListener('change', render);
render();
