const PONEDORAS = {
  cafe: {
    nombre: 'Hy-Line Brown / Lohmann Brown',
    consumo_g: 115,
    agua_ratio: 1.8,
    postura_pico: 96,
    postura_prom: 92,
    espacio: { piso: 0.10, jaula: 0.055, semi: 0.25 },
    comedero_cm: 10,
    bebedero: { nipple: 8, campana: 80, canal: 10 },
    nido: 5,
  },
  blanco: {
    nombre: 'Hy-Line W-36 / Lohmann LSL',
    consumo_g: 100,
    agua_ratio: 1.8,
    postura_pico: 97,
    postura_prom: 93,
    espacio: { piso: 0.09, jaula: 0.045, semi: 0.22 },
    comedero_cm: 10,
    bebedero: { nipple: 8, campana: 80, canal: 10 },
    nido: 5,
  }
};

const POLLITAS = {
  cafe: {
    nombre: 'Hy-Line Brown / Lohmann Brown',
    fase1: {
      label: 'Inicio (0–8 sem)',
      consumo_g: 30,
      agua_ratio: 2.0,
      espacio_m2: 0.05,
      comedero_cm: 5,
      bebedero: { nipple: 10, campana: 50, canal: 4 },
    },
    fase2: {
      label: 'Desarrollo (9–17 sem)',
      consumo_g: 75,
      agua_ratio: 1.9,
      espacio_m2: 0.08,
      comedero_cm: 8,
      bebedero: { nipple: 8, campana: 60, canal: 8 },
    },
  },
  blanco: {
    nombre: 'Hy-Line W-36 / Lohmann LSL',
    fase1: {
      label: 'Inicio (0–8 sem)',
      consumo_g: 25,
      agua_ratio: 2.0,
      espacio_m2: 0.045,
      comedero_cm: 5,
      bebedero: { nipple: 10, campana: 50, canal: 4 },
    },
    fase2: {
      label: 'Desarrollo (9–17 sem)',
      consumo_g: 65,
      agua_ratio: 1.9,
      espacio_m2: 0.075,
      comedero_cm: 8,
      bebedero: { nipple: 8, campana: 60, canal: 8 },
    },
  }
};

const TEMP = [
  { sem: '1', rango: '32–34 °C' },
  { sem: '2', rango: '30–32 °C' },
  { sem: '3', rango: '28–30 °C' },
  { sem: '4', rango: '26–28 °C' },
  { sem: '5–6', rango: '24–26 °C' },
  { sem: '7–8', rango: '22–24 °C' },
  { sem: '9–17', rango: '18–22 °C (ambiental)' },
];

function beb_label(tipo) {
  return { nipple: 'nipple', campana: 'campana', canal: 'canaleta de 1 m' }[tipo];
}
function beb_referencia(tipo) {
  return {
    nipple: 'aves por nipple',
    campana: 'aves por campana',
    canal: 'cm de canal por ave',
  }[tipo];
}

function calcPonedoras() {
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  const sistema = document.getElementById('sel-sistema').value;
  const beb = document.getElementById('sel-bebedero').value;
  const com = document.getElementById('sel-comedero').value;
  const n = parseInt(document.getElementById('p-aves').value);
  document.getElementById('p-aves-val').textContent = n;

  document.getElementById('opt-cafe').classList.toggle('selected', tipo === 'cafe');
  document.getElementById('opt-blanco').classList.toggle('selected', tipo === 'blanco');

  const d = PONEDORAS[tipo];
  const espacio = (n * d.espacio[sistema]).toFixed(1);
  const alimento_mes = Math.round(d.consumo_g * n * 30 / 1000);
  const agua_mes = Math.round(alimento_mes * d.agua_ratio);
  const huevos_mes = Math.round(n * d.postura_prom / 100 * 30);
  const nidos = Math.ceil(n / d.nido);

  let comederos_val, comederos_ref;
  if (com === 'cilindrico') {
    comederos_val = Math.ceil(n / 25);
    comederos_ref = '1 tolva c/ 25 aves';
  } else {
    comederos_val = Math.ceil(n * d.comedero_cm / 100) + ' m';
    comederos_ref = d.comedero_cm + ' cm por ave (lineal)';
  }

  let bebederos, beb_ref;
  if (beb === 'canal') {
    bebederos = Math.ceil(n * 0.025) + ' m';
    beb_ref = '2.5 cm por ave (canal)';
  } else {
    bebederos = Math.ceil(n / d.bebedero[beb]);
    beb_ref = beb_referencia(beb);
  }

  const sistema_txt = { piso: 'piso (cama)', jaula: 'jaulas', semi: 'semi-pastoreo' }[sistema];
  const jaula_nota = sistema === 'jaula'
    ? '<br><strong>Espacio en jaula:</strong> ' + (d.espacio.jaula * 10000) + ' cm² por ave.'
    : '';

  const cards = [
    { emoji: '🏠', label: 'Espacio mínimo', val: espacio + ' m²', unit: sistema_txt },
    { emoji: '🍽️', label: 'Comederos', val: String(comederos_val), unit: comederos_ref },
    { emoji: '💧', label: 'Bebederos (' + beb_label(beb) + ')', val: bebederos, unit: beb_ref },
    { emoji: '🪺', label: 'Nidos', val: nidos, unit: '1 nido c/ ' + d.nido + ' aves' },
    { emoji: '🌾', label: 'Alimento / mes', val: alimento_mes + ' kg', unit: d.consumo_g + ' g/ave/día' },
    { emoji: '🪣', label: 'Agua / mes', val: agua_mes + ' L', unit: 'ratio ' + d.agua_ratio + ':1' },
    { emoji: '🥚', label: 'Huevos estimados / mes', val: huevos_mes.toLocaleString(), unit: d.postura_prom + '% postura', hl: true },
  ];

  document.getElementById('p-resultados').innerHTML = cards.map(c =>
    '<div class="res-card' + (c.hl ? ' highlight' : '') + '">' +
    '<div class="res-icon">' + c.emoji + '</div>' +
    '<div class="res-label">' + c.label + '</div>' +
    '<div class="res-val">' + c.val + '</div>' +
    '<div class="res-unit">' + c.unit + '</div></div>'
  ).join('');

  // Texto explicativo
  const posturaTexto = d.postura_prom >= 90 ? 'alta' : d.postura_prom >= 80 ? 'moderada' : 'baja';
  const sistemaTexto = { piso: 'sistema de piso con cama profunda', jaula: 'jaulas convencionales', semi: 'sistema de semi-pastoreo' }[sistema];
  const comederoTexto = com === 'cilindrico'
    ? comederos_val + ' tolvas cilíndricas (tipo balde/tolva)'
    : comederos_val + ' de comedero lineal';
  document.getElementById('p-nota').innerHTML =
    '<strong>Sobre estos resultados:</strong> Para ' + n.toLocaleString() + ' ' + d.nombre + ' en ' + sistemaTexto +
    ', se estiman ' + huevos_mes.toLocaleString() + ' huevos mensuales con una postura promedio ' + posturaTexto + ' de ' + d.postura_prom + '%. ' +
    'El proyecto requiere ' + espacio + ' m² de espacio, ' + comederoTexto + ', ' +
    'y un consumo mensual de ' + alimento_mes + ' kg de alimento y ' + agua_mes + ' L de agua. ' +
    'Estos valores corresponden a aves en pico de producción (sem 26–45). ' +
    'La producción real varía según sanidad, temperatura y calidad del alimento.' + jaula_nota;
}
function calcPollitas() {
  const tipo = document.querySelector('input[name="tipo-poll"]:checked').value;
  const etapa = document.getElementById('sel-etapa').value;
  const beb = document.getElementById('sel-beb-poll').value;
  const com = document.getElementById('sel-com-poll').value;
  const n = parseInt(document.getElementById('poll-aves').value);
  document.getElementById('poll-aves-val').textContent = n;

  document.getElementById('poll-opt-cafe').classList.toggle('selected', tipo === 'cafe');
  document.getElementById('poll-opt-blanco').classList.toggle('selected', tipo === 'blanco');

  const d = POLLITAS[tipo][etapa];
  const espacio = (n * d.espacio_m2).toFixed(1);
  const alimento_mes = Math.round(d.consumo_g * n * 30 / 1000);
  const agua_mes = Math.round(alimento_mes * d.agua_ratio);

  let comederos_val, comederos_ref;
  if (com === 'cilindrico') {
    comederos_val = Math.ceil(n / 20);
    comederos_ref = '1 tolva c/ 20 pollitas';
  } else {
    comederos_val = Math.ceil(n * d.comedero_cm / 100) + ' m';
    comederos_ref = d.comedero_cm + ' cm por pollita (lineal)';
  }

  let bebederos, beb_ref;
  if (beb === 'canal') {
    bebederos = Math.ceil(n * d.comedero_cm / 100) + ' m';
    beb_ref = 'canal por etapa';
  } else {
    bebederos = Math.ceil(n / d.bebedero[beb]);
    beb_ref = beb_referencia(beb);
  }

  const cards = [
    { emoji: '🏠', label: 'Espacio mínimo', val: espacio + ' m²', unit: 'cama/piso' },
    { emoji: '🍽️', label: 'Comederos', val: String(comederos_val), unit: comederos_ref },
    { emoji: '💧', label: 'Bebederos (' + beb_label(beb) + ')', val: bebederos, unit: beb_ref },
    { emoji: '🌾', label: 'Alimento / mes', val: alimento_mes + ' kg', unit: d.consumo_g + ' g/ave/día' },
    { emoji: '🪣', label: 'Agua / mes', val: agua_mes + ' L', unit: 'ratio ' + d.agua_ratio + ':1' },
  ];

  document.getElementById('poll-resultados').innerHTML = cards.map(c =>
    '<div class="res-card">' +
    '<div class="res-icon">' + c.emoji + '</div>' +
    '<div class="res-label">' + c.label + '</div>' +
    '<div class="res-val">' + c.val + '</div>' +
    '<div class="res-unit">' + c.unit + '</div></div>'
  ).join('');

  const tempRows = etapa === 'fase1'
    ? TEMP.filter(function(_, i) { return i < 6; })
    : TEMP.filter(function(_, i) { return i >= 6; });

  document.getElementById('poll-temp-tabla').innerHTML =
    '<tr><th>Semana</th><th>Temperatura brooder</th></tr>' +
    tempRows.map(function(r) { return '<tr><td>' + r.sem + '</td><td>' + r.rango + '</td></tr>'; }).join('');

  const etapaTexto = etapa === 'fase1' ? 'fase de inicio (semanas 1–8)' : 'fase de desarrollo (semanas 9–17)';
  const comederoTexto = com === 'cilindrico'
    ? comederos_val + ' tolvas cilíndricas'
    : comederos_val + ' de comedero lineal';
  document.getElementById('poll-nota').innerHTML =
    '<strong>Sobre estos resultados:</strong> Para ' + n.toLocaleString() + ' pollitas de ' + POLLITAS[tipo].nombre + ' en ' + etapaTexto +
    ', se requieren ' + espacio + ' m² de espacio mínimo, ' + comederoTexto + ' y un consumo estimado de ' +
    alimento_mes + ' kg de alimento y ' + agua_mes + ' L de agua por mes. ' +
    'En fase de inicio controle la temperatura de la campana criadora diariamente. ' +
    'Reduzca gradualmente según la tabla. Apiñamiento bajo la campana indica frío; alejamiento excesivo indica calor.';
}
function setTab(tab) {
  document.getElementById('tab-ponedoras').classList.toggle('active', tab === 'ponedoras');
  document.getElementById('tab-pollitas').classList.toggle('active', tab === 'pollitas');
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && tab === 'ponedoras') || (i === 1 && tab === 'pollitas'));
  });
}

calcPonedoras();
calcPollitas();
