// ============================================================
// Calculadora de conversión de alimento (FCR)
// - Engorde: FCR = alimento consumido (kg) ÷ kg de peso vivo ganado.
// - Postura: FCR = alimento consumido (kg) ÷ kg de huevo producido
//   (huevos × peso promedio del huevo). No se mide contra peso vivo
//   porque una ponedora adulta casi no gana peso.
// El FCR "bueno" depende de la edad, la línea y la especie — por eso
// no hay semáforo de bueno/malo, solo el número.
// ============================================================
let modo = 'engorde';

const btns = document.querySelectorAll('.modo-btn');
const camposEngorde = document.getElementById('camposEngorde');
const camposPostura = document.getElementById('camposPostura');
const toolEmptyEngorde = document.getElementById('toolEmptyEngorde');
const toolResultsEngorde = document.getElementById('toolResultsEngorde');
const toolEmptyPostura = document.getElementById('toolEmptyPostura');
const toolResultsPostura = document.getElementById('toolResultsPostura');

const avesInput = document.getElementById('fcrAves');
const pIniInput = document.getElementById('fcrPesoIni');
const pFinInput = document.getElementById('fcrPesoFin');
const alimentoInput = document.getElementById('fcrAlimento');

const huevosInput = document.getElementById('fcrHuevos');
const pesoHuevoInput = document.getElementById('fcrPesoHuevo');
const alimentoPosturaInput = document.getElementById('fcrAlimentoPostura');

function num(el) {
  const v = parseFloat(String(el.value).replace(',', '.'));
  return Number.isFinite(v) ? v : NaN;
}
function fmt(val, decimals = 2) {
  return new Intl.NumberFormat('es-CL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(val);
}

function renderEngorde() {
  const aves = num(avesInput), pIni = num(pIniInput), pFin = num(pFinInput), alimento = num(alimentoInput);
  const valid = [aves, pIni, pFin, alimento].every(Number.isFinite) && aves > 0 && alimento > 0 && pFin > pIni;
  if (!valid) { toolEmptyEngorde.style.display = 'block'; toolResultsEngorde.style.display = 'none'; return null; }
  toolEmptyEngorde.style.display = 'none'; toolResultsEngorde.style.display = 'block';

  const gananciaIndividualG = pFin - pIni;
  const gananciaTotalKg = (gananciaIndividualG * aves) / 1000;
  const fcr = alimento / gananciaTotalKg;
  const alimentoPorAveKg = alimento / aves;

  document.getElementById('rFCR').textContent = fmt(fcr, 2);
  document.getElementById('rGananciaAve').textContent = fmt(gananciaIndividualG, 0);
  document.getElementById('rGananciaTotal').textContent = fmt(gananciaTotalKg, 1);
  document.getElementById('rAlimentoAve').textContent = fmt(alimentoPorAveKg, 2);

  return `FCR engorde: ${fmt(fcr, 2)} | ${aves} aves | Ganancia/ave: ${fmt(gananciaIndividualG, 0)} g | Alimento total: ${fmt(alimento, 1)} kg`;
}

function renderPostura() {
  const huevos = num(huevosInput), pesoHuevo = num(pesoHuevoInput), alimento = num(alimentoPosturaInput);
  const valid = [huevos, pesoHuevo, alimento].every(Number.isFinite) && huevos > 0 && pesoHuevo > 0 && alimento > 0;
  if (!valid) { toolEmptyPostura.style.display = 'block'; toolResultsPostura.style.display = 'none'; return null; }
  toolEmptyPostura.style.display = 'none'; toolResultsPostura.style.display = 'block';

  const masaHuevoKg = (huevos * pesoHuevo) / 1000;
  const fcrPostura = alimento / masaHuevoKg;
  const docenas = huevos / 12;
  const alimentoPorDocenaKg = alimento / docenas;
  const alimentoPorHuevoG = (alimento * 1000) / huevos;

  document.getElementById('rFCRPostura').textContent = fmt(fcrPostura, 2);
  document.getElementById('rMasaHuevo').textContent = fmt(masaHuevoKg, 1);
  document.getElementById('rAlimentoDocena').textContent = fmt(alimentoPorDocenaKg, 2);
  document.getElementById('rAlimentoHuevo').textContent = fmt(alimentoPorHuevoG, 1);

  return `FCR postura: ${fmt(fcrPostura, 2)} kg alim/kg huevo | ${huevos} huevos | Alimento: ${fmt(alimento, 1)} kg | Alimento/docena: ${fmt(alimentoPorDocenaKg, 2)} kg`;
}

function render() {
  const resumen = modo === 'engorde' ? renderEngorde() : renderPostura();
  const campoResultado = document.getElementById('field-resultado');
  if (campoResultado && resumen) campoResultado.value = resumen;
}

function setModo(nuevo) {
  modo = nuevo;
  btns.forEach((b) => b.classList.toggle('active', b.dataset.modo === modo));
  camposEngorde.style.display = modo === 'engorde' ? 'block' : 'none';
  camposPostura.style.display = modo === 'postura' ? 'block' : 'none';
  toolEmptyEngorde.style.display = modo === 'engorde' ? 'block' : 'none';
  toolResultsEngorde.style.display = 'none';
  toolEmptyPostura.style.display = modo === 'postura' ? 'block' : 'none';
  toolResultsPostura.style.display = 'none';
  render();
}

btns.forEach((b) => b.addEventListener('click', () => setModo(b.dataset.modo)));
[avesInput, pIniInput, pFinInput, alimentoInput, huevosInput, pesoHuevoInput, alimentoPosturaInput]
  .forEach((el) => el.addEventListener('input', render));

render();
