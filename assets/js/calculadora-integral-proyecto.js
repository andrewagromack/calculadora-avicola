
const DIAS_MES = 30.4;
const SEMS_RECRIA = 17;

function seqFromObject(start, end, obj){
  const arr=[];
  for(let w=start; w<=end; w++) arr.push(obj[w]);
  return arr;
}
function avg(a,b){ return (a+b)/2; }

const TECH = {
  hyline_brown:{
    nombre:'Huevo café',
    linea:'Hy-Line Brown estándar internacional',
    tipo:'Huevo café',
    fuente:'Base Hy-Line Brown: crianza sem. 1–17 y producción sem. 18–100. Postura, consumo de alimento, consumo de agua y mortalidad se calculan desde tabla semanal; los rangos bajo/alto se promedian.',
    espacio:{piso:0.10,jaula:0.055,semi:0.25}, espacioCria:0.06,
    comederoCm:10, avesPorTolva:30, avesPorNipple:8, avesPorCampana:80, bebederoCm:10, avesPorNido:5,
    rearing:{start:1,end:17,
      mort:[0.40,0.55,0.65,0.75,0.85,0.95,1.05,1.15,1.25,1.35,1.45,1.55,1.63,1.70,1.78,1.85,2.00],
      feed:[16.5,18.5,22,27,32,38.5,44.5,50,55,59,63,65.5,68,70.5,72.5,75.5,79.5],
      water:[28.5,32,38,46.5,54.5,68.5,78.5,88,97,104,110.5,115,119.5,123.5,127,132,139]
    },
    production:{start:18,end:100,
      posture:[], feed:[], water:[], mort:[]
    }
  },
  hyline_w36:{
    nombre:'Huevo blanco',
    linea:'Hy-Line W-80 estándar internacional',
    tipo:'Huevo blanco',
    fuente:'Base Hy-Line W-80: crianza sem. 1–17 y producción sem. 18–100. Postura, consumo de alimento, consumo de agua y mortalidad se calculan desde tabla semanal; los rangos bajo/alto se promedian.',
    espacio:{piso:0.09,jaula:0.045,semi:0.22}, espacioCria:0.055,
    comederoCm:10, avesPorTolva:30, avesPorNipple:8, avesPorCampana:80, bebederoCm:10, avesPorNido:5,
    rearing:{start:1,end:17,
      mort:[1.00,1.40,1.60,1.71,1.81,1.90,2.02,2.12,2.21,2.31,2.40,2.53,2.65,2.79,2.91,3.03,3.20],
      feed:[14.5,19,22.5,26.5,31.5,36,40.5,44,47,50,53,56,60,63,66,70,73],
      water:[21.5,28.5,34.5,39.5,47,54,60,66,70.5,75.5,80,84.5,89.5,94.5,99.5,105,110]
    },
    production:{start:18,end:100,
      posture:[], feed:[], water:[], mort:[]
    }
  }
};

// Hy-Line Brown estándar internacional: producción sem. 18–100
TECH.hyline_brown.production.posture = [6.85,24.6,53.75,77.75,89.1,93.0,94.7,95.45,96.05,96.0,96.05,95.85,95.75,95.65,95.5,95.45,95.35,95.35,95.1,95.0,94.9,94.7,94.55,94.45,94.25,94.1,93.9,93.7,93.6,93.4,93.0,93.0,92.8,92.15,92.2,92.1,91.9,91.65,91.35,91.15,90.85,90.6,90.35,90.0,89.4,89.1,88.65,88.45,88.15,87.65,87.45,87.1,86.5,86.4,86.0,85.65,85.25,84.9,84.5,84.05,83.7,83.3,82.85,82.5,82.1,81.7,81.25,80.85,80.45,80.15,79.55,79.15,78.6,77.8,77.8,77.4,76.8,76.45,76.05,75.55,75.15,74.65,74.2];
TECH.hyline_brown.production.feed = [83,89,94.5,102,104.5,108,110.5,113,113,113.5,113.5,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114,114];
TECH.hyline_brown.production.water = [105,157.5,167,180,184,190,194.5,197,199,199.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5,200.5];
TECH.hyline_brown.production.mort = [0.24,0.28,0.32,0.36,0.40,0.44,0.49,0.53,0.58,0.62,0.67,0.72,0.77,0.82,0.87,0.92,0.97,1.03,1.09,1.14,1.20,1.26,1.32,1.38,1.44,1.51,1.57,1.64,1.71,1.78,1.85,1.92,1.99,2.07,2.15,2.23,2.31,2.39,2.47,2.56,2.65,2.74,2.83,2.92,3.02,3.12,3.22,3.32,3.42,3.52,3.64,3.75,3.86,3.97,4.09,4.21,4.34,4.46,4.58,4.71,4.84,4.99,5.13,5.27,5.41,5.55,5.72,5.87,6.02,6.18,6.34,6.51,6.69,6.86,7.04,7.22,7.40,7.60,7.79,7.99,8.19,8.39,8.60];

// Hy-Line W-80: producción sem. 18–100
TECH.hyline_w36.production.posture = [0.15,6.45,43.35,73.8,83.55,88.7,91.65,94.3,94.4,95.3,95.2,95.9,96.2,96.2,96.2,96.1,95.9,95.9,95.7,95.6,95.3,95.1,95.0,94.8,94.6,94.5,94.3,94.1,93.9,93.8,93.6,93.4,93.25,93.1,92.95,92.75,92.55,92.35,92.25,92.05,91.95,91.75,91.5,91.4,91.25,90.9,90.9,90.7,90.55,90.4,90.2,90.05,89.9,89.7,89.5,89.3,89.0,88.7,88.35,88.0,87.65,87.3,86.95,86.6,86.25,85.9,85.6,85.2,84.9,84.4,84.2,83.7,83.5,83.15,82.85,82.45,82.15,81.65,81.5,81.1,80.85,80.5,80.0];
TECH.hyline_w36.production.feed = [77.25,81.7,84.55,88.15,90.75,93.6,95.7,99.0,99.0,100.25,101.85,102.2,102.55,103.9,104.9,105.6,106.3,107.05,107.55,107.95,108.15,108.6,108.75,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9,108.9];
TECH.hyline_w36.production.water = [115.8,121.05,126.9,132.25,136.75,140.45,143.55,146.2,148.45,150.4,152,153.3,154.55,155.9,157.4,158.4,159.45,160.55,161.3,162,162.5,162.9,163.1,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4,163.4];
TECH.hyline_w36.production.mort = [0.04,0.20,0.33,0.46,0.60,0.73,0.86,0.99,1.12,1.25,1.38,1.51,1.64,1.77,1.90,2.02,2.15,2.27,2.40,2.52,2.64,2.76,2.87,2.99,3.11,3.22,3.33,3.44,3.57,3.68,3.78,3.88,3.98,4.08,4.17,4.27,4.36,4.46,4.55,4.64,4.74,4.83,4.92,5.02,5.11,5.21,5.31,5.40,5.50,5.60,5.71,5.81,5.92,6.03,6.14,6.28,6.40,6.52,6.64,6.77,6.90,7.02,7.15,7.29,7.42,7.56,7.69,7.83,7.97,8.11,8.25,8.40,8.54,8.68,8.83,8.97,9.12,9.26,9.41,9.56,9.70,9.85,9.99];


let modoActual='postura';
let currentEquipItems=[];
let lastEquipSignature='';
const el=id=>document.getElementById(id);
const n=id=>Number(el(id)?.value||0);
const v=id=>el(id)?.value||'';

function money(val){
  const m=v('moneda'),d=(m==='CLP'||m==='COP')?0:2;
  return new Intl.NumberFormat('es-CL',{style:'currency',currency:m||'USD',minimumFractionDigits:d,maximumFractionDigits:d}).format(isFinite(val)?val:0);
}
function num(val,d=0){return new Intl.NumberFormat('es-CL',{minimumFractionDigits:d,maximumFractionDigits:d}).format(isFinite(val)?val:0);}
function row(l,v2,cls=''){return`<tr class="${cls}"><td>${l}</td><td>${v2}</td></tr>`;}
function outRow(l,v2){return row(l,v2,'money-out');}
function negClass(val){return val<0?'td-neg':'';}
function rangeWeeks(start,end){const a=[];for(let w=start;w<=end;w++)a.push(w);return a;}
function clampIndex(idx, arr){return Math.max(0, Math.min(arr.length-1, idx));}
function dataForWeek(line, phase, week, metric){
  let src=line[phase];
  if(!src || !src[metric]){
    const fb=TECH[line.fallbackKey] || null;
    src=fb?fb[phase]:src;
  }
  if(!src || !src[metric]) return 0;
  const idx=clampIndex(week-src.start, src[metric]);
  return src[metric][idx];
}
function cumulativeMort(line, phase, week){return dataForWeek(line, phase, week, 'mort');}
function liveBirds(initial,line,phase,week){return initial * (1 - cumulativeMort(line,phase,week)/100);}
function weekArrayForProduction(line, prodMonth){
  const start=line.production.start + (prodMonth-1)*4;
  const end=Math.min(start+3, line.production.end);
  return rangeWeeks(start,end);
}
function productionMonth(line, initialBirds, prodMonth){
  const weeks=weekArrayForProduction(line, prodMonth);
  let eggs=0, feedKg=0, waterL=0, postSum=0, lastWeek=weeks[weeks.length-1];
  weeks.forEach(w=>{
    const live=liveBirds(initialBirds,line,'production',w);
    const post=dataForWeek(line,'production',w,'posture');
    const feed=dataForWeek(line,'production',w,'feed');
    const water=dataForWeek(line,'production',w,'water');
    eggs += live * (post/100) * 7;
    feedKg += live * feed * 7/1000;
    waterL += live * water * 7/1000;
    postSum += post;
  });
  return {weeks, weekStart:weeks[0], weekEnd:lastWeek, alive:liveBirds(initialBirds,line,'production',lastWeek), posture:postSum/weeks.length, eggs, feedKg, waterL, mort:cumulativeMort(line,'production',lastWeek)};
}
function rearingPeriod(line, initialBirds, weekStart, weekEnd){
  let feedKg=0, waterL=0;
  const weeks=rangeWeeks(weekStart, weekEnd);
  weeks.forEach(w=>{
    const live=liveBirds(initialBirds,line,'rearing',w);
    feedKg += live * dataForWeek(line,'rearing',w,'feed') * 7/1000;
    waterL += live * dataForWeek(line,'rearing',w,'water') * 7/1000;
  });
  const last=weeks[weeks.length-1];
  return {weeks, alive:liveBirds(initialBirds,line,'rearing',last), feedKg, waterL, mort:cumulativeMort(line,'rearing',last), weekStart, weekEnd};
}
function totalRearingFeedKg(line, aves, weekEnd){return rearingPeriod(line,aves,1,weekEnd).feedKg;}
function sourceWarnings(line){
  return [
    `Fuente técnica: ${line.fuente}`,
    'Nota: cálculos basados en tablas Hy-Line. Si utiliza otra línea genética, re-chequee los valores técnicos con la guía correspondiente.'
  ];
}

function setModo(modo){
  if(modo!=='postura' && modo!=='cria') modo='postura';
  modoActual=modo;
  document.querySelectorAll('.modo-btn').forEach(b=>b.classList.toggle('active',b.dataset.modo===modo));
  const esCria=modo==='cria', esPos=modo==='postura';
  function fc(id,show){const e=el(id);if(e)e.classList.toggle('on',show);}
  fc('f-precio-gallina',esPos);
  fc('f-precio-pollita',esCria);
  fc('f-precio-venta-recria',esCria);
  fc('f-semana-venta',esCria);
  fc('f-precio-huevo',esPos);
  fc('f-alimento-postura',esPos);
  fc('f-alimento-cria',esCria);
  fc('f-reposicion',esPos);
  const lbl=el('lbl-gallina'); if(lbl) lbl.textContent='Precio gallina lista para postura';
  const hint=el('hint-gallina'); if(hint) hint.textContent='Ave en semana 17–18, lista para iniciar postura.';
  const p=TECH[v('curva')];
  if(esPos) el('hint-meses').textContent=`Producción desde sem. ${p.production.start} hasta sem. ${p.production.end}, agrupada en meses operativos de 4 semanas.`;
  else el('hint-meses').textContent='Cría: semanas 1–17 con consumo, agua y mortalidad por tabla técnica Hy-Line.';
  calcular();
}

function renderEquip(aves,p,esCria){
  const tc=v('tipoComedero'),tb=v('tipoBebedero');
  const list=el('equip-list');list.innerHTML='';
  const items=[];
  let qtyLabel,pId,pDefault,pLabel,calc,why;
  const avesPorTolva=esCria?30:p.avesPorTolva;
  const comederoCm=esCria?8:p.comederoCm;
  if(tc==='tolva'){
    const u=Math.ceil(aves/avesPorTolva); qtyLabel=`${num(u)} tolvas / comederos cilíndricos`; pId='p-comedero'; pDefault=18; pLabel='Precio por tolva'; calc=()=>u*n('p-comedero'); why=`1 tolva cada ${avesPorTolva} aves${esCria?' en recría.':'.'}`;
  } else {
    const m2=aves*comederoCm/100; qtyLabel=`${num(m2,1)} metros lineales`; pId='p-comedero'; pDefault=12; pLabel='Precio por metro lineal'; calc=()=>m2*n('p-comedero'); why=`${comederoCm} cm de borde por ave${esCria?' en recría.':'.'}`;
  }
  items.push({emoji:'🍽️',name:'Comederos',qty:qtyLabel,why,pId,pLabel,pDefault,calc});

  if(tb==='nipple'){
    const u=Math.ceil(aves/p.avesPorNipple); items.push({emoji:'💧',name:'Bebederos',qty:`${num(u)} nipples / chupetes`,why:`1 nipple cada ${p.avesPorNipple} aves.`,pId:'p-bebedero',pDefault:1.20,pLabel:'Precio por nipple',calc:()=>u*n('p-bebedero')});
  } else if(tb==='campana'){
    const u=Math.ceil(aves/p.avesPorCampana); items.push({emoji:'💧',name:'Bebederos',qty:`${num(u)} campanas / cazoletas`,why:`1 campana cada ${p.avesPorCampana} aves.`,pId:'p-bebedero',pDefault:25,pLabel:'Precio por campana',calc:()=>u*n('p-bebedero')});
  } else {
    const m2=aves*p.bebederoCm/100; items.push({emoji:'💧',name:'Bebederos',qty:`${num(m2,1)} metros lineales de canal`,why:`${p.bebederoCm} cm de canal por ave.`,pId:'p-bebedero',pDefault:10,pLabel:'Precio por metro lineal',calc:()=>m2*n('p-bebedero')});
  }
  if(!esCria){
    const u=Math.ceil(aves/p.avesPorNido); items.push({emoji:'🪹',name:'Nidos',qty:`${num(u)} nidos`,why:`1 nido cada ${p.avesPorNido} gallinas.`,pId:'p-nido',pLabel:'Precio por nido',pDefault:15,calc:()=>u*n('p-nido')});
  }
  items.forEach(item=>{
    const prevVal=el(item.pId)?.value??item.pDefault;
    const div=document.createElement('div'); div.className='equip-item';
    div.innerHTML=`<div class="equip-left"><div class="equip-emoji">${item.emoji}</div><div class="equip-body"><div class="equip-name">${item.name}</div><div class="equip-qty">Necesitas: ${item.qty}</div><div class="equip-why">${item.why}</div></div></div><div class="equip-right"><label for="${item.pId}">${item.pLabel}</label><input type="number" id="${item.pId}" value="${prevVal}" min="0" step="0.1"><div class="equip-subtotal" id="${item.pId}-sub">—</div></div>`;
    list.appendChild(div);
    el(item.pId).addEventListener('input',calcular);
    el(item.pId).addEventListener('change',calcular);
  });
  return items;
}

function calcular(){
  const aves=Math.max(1,n('aves'));
  const p=TECH[v('curva')];
  const sistema=v('sistema');
  const meses=Math.min(36,Math.max(1,n('meses')));
  const otrosM=n('manoObra')+n('otrosMensuales');
  const tasaR=n('tasaReposicion')/100;
  const esCria=modoActual==='cria';
  const areaPos=aves*p.espacio[sistema];
  const area=esCria?aves*p.espacioCria:areaPos;

  const equipSignature=[modoActual,aves,v('curva'),v('tipoComedero'),v('tipoBebedero')].join('|');
  const items=(equipSignature===lastEquipSignature)?currentEquipItems:(lastEquipSignature=equipSignature,currentEquipItems=renderEquip(aves,p,esCria));
  let costoEquip=0;
  items.forEach(item=>{const c=item.calc();costoEquip+=c;const sub=el(`${item.pId}-sub`);if(sub)sub.textContent=n(item.pId)>0?`Subtotal: ${money(c)}`:'—';});

  const costoInfraM2=area*n('costoM2');
  const costoInfraFijo=n('infraExtra');
  const costoInfra=costoInfraM2+costoInfraFijo;
  const depre=costoInfra/Math.max(1,n('vidaUtilInfra'));
  const costoAves=modoActual==='postura'?aves*n('precioAvePostura'):aves*n('precioPollita');
  const precioCompraUnit=modoActual==='postura'?n('precioAvePostura'):n('precioPollita');
  const textoCompra=modoActual==='postura'?'Compra de gallinas listas para postura':'Compra de pollitas de 1 día';
  const inversion=costoAves+costoInfra+costoEquip;

  el('infra-resumen').innerHTML=`
    <div class="infra-item"><div class="infra-item-name">${textoCompra}</div><div class="infra-item-val">${num(aves)} aves × ${money(precioCompraUnit)} = ${money(costoAves)}</div><div class="infra-item-hint">Este valor entra en la inversión inicial del proyecto.</div></div>
    <div class="infra-item"><div class="infra-item-name">Equipamiento calculado</div><div class="infra-item-val">${money(costoEquip)}</div><div class="infra-item-hint">Suma de comederos, bebederos y nidos cuando corresponde.</div></div>
    <div class="infra-item"><div class="infra-item-name">Construcción del gallinero</div><div class="infra-item-val">${num(area,1)} m² × ${money(n('costoM2'))}/m² = ${money(costoInfraM2)}</div><div class="infra-item-hint">Área calculada para ${num(aves)} aves en sistema ${sistema==='piso'?'piso/cama':sistema==='jaula'?'jaula':'semi-pastoreo'}.</div></div>
    <div class="infra-item"><div class="infra-item-name">Otros costos de infraestructura</div><div class="infra-item-val">${money(costoInfraFijo)}</div><div class="infra-item-hint">Depreciación estimada: ${money(depre)}/mes sobre ${n('vidaUtilInfra')} meses.</div></div>`;

  el('k-aves').textContent=num(aves);
  el('k-area').textContent=`${num(area,1)} m²`;
  el('k-inversion').textContent=money(inversion);
  el('total-inversion').textContent=money(inversion);
  if(esCria){const r17= rearingPeriod(p,aves,17,17); el('k-alim-label').textContent='Alimento / día'; el('k-alim-sub').textContent='Semana 17 recría'; el('k-alimento').textContent=`${num(dataForWeek(p,'rearing',17,'feed')*r17.alive/1000,1)} kg`;}
  else{const pm1=productionMonth(p,aves,1); el('k-alim-label').textContent='Alimento / mes'; el('k-alim-sub').textContent=`Sem. ${pm1.weekStart}–${pm1.weekEnd}`; el('k-alimento').textContent=`${num(pm1.feedKg,0)} kg`;}

  let flujoHTML='', flujoAcum=-inversion, peorAcum=-inversion, mesRecup=null, htmlEco='';

  if(modoActual==='postura'){
    el('flujo-nota').textContent='La inversión inicial se descuenta desde el mes 1. Postura, alimento, agua y mortalidad se agrupan desde tablas semanales Hy-Line.';
    el('flujo-thead').innerHTML='<tr><th>Mes</th><th>Semanas</th><th>Aves</th><th>Postura</th><th>Huevos</th><th>Alim. kg</th><th>Agua L</th><th>Ingresos</th><th>Costo alim.</th><th>Otros costos</th><th>Repos.</th><th>Egresos op.</th><th>Flujo neto</th><th>Acumulado</th></tr>';
    const pm1=productionMonth(p,aves,1);
    const ing1=pm1.eggs*n('precioHuevo'), egrAlim1=pm1.feedKg*n('precioAlimentoPostura'), egrOp1=egrAlim1+otrosM;
    const cH=pm1.eggs>0?egrOp1/pm1.eggs:0, cHD=pm1.eggs>0?(egrOp1+depre)/pm1.eggs:0;
    htmlEco=[row('Semanas usadas mes 1',`${pm1.weekStart}–${pm1.weekEnd}`), row('Postura esperada mes 1',`${num(pm1.posture,1)}%`), row('Mortalidad acumulada mes 1',`${num(pm1.mort,2)}%`), row('Aves vivas fin mes 1',`${num(pm1.alive,0)}`), row('Huevos esperados mes 1',`${num(pm1.eggs,0)} unidades`), row('Docenas mes 1',`${num(pm1.eggs/12,0)}`), row('Ingreso estimado mes 1',money(ing1)), outRow('Consumo alimento mes 1',`${num(pm1.feedKg,0)} kg · ${money(egrAlim1)}`), outRow('Consumo agua mes 1',`${num(pm1.waterL,0)} L`), outRow('Otros costos mensuales',money(otrosM)), outRow('Costo operativo por huevo (mes 1)',money(cH)), outRow('Costo por huevo incl. depreciación infra',money(cHD)), row('Precio de venta por huevo',money(n('precioHuevo'))), row('Margen operativo por huevo (mes 1)',money(n('precioHuevo')-cH)), row('Flujo operativo mes 1',money(ing1-egrOp1),negClass(ing1-egrOp1)), outRow('Depreciación mensual infraestructura',money(depre))].join('');
    for(let m=1;m<=meses;m++){
      const pm=productionMonth(p,aves,m);
      const ing=pm.eggs*n('precioHuevo');
      const costoAlim=pm.feedKg*n('precioAlimentoPostura');
      const repos=m>1&&tasaR>0?aves*tasaR*n('precioAvePostura'):0;
      const egOp=costoAlim+otrosM+repos;
      const fl=ing-egOp; flujoAcum+=fl; if(flujoAcum<peorAcum)peorAcum=flujoAcum; if(mesRecup===null&&flujoAcum>=0)mesRecup=m;
      const cls=mesRecup===m?'recuperado':fl<0?'flujo-neg':'';
      flujoHTML+=`<tr class="${cls}"><td>${m}</td><td>${pm.weekStart}–${pm.weekEnd}</td><td>${num(pm.alive,0)}</td><td>${num(pm.posture,1)}%</td><td>${num(pm.eggs,0)}</td><td>${num(pm.feedKg,0)}</td><td>${num(pm.waterL,0)}</td><td>${money(ing)}</td><td class="td-egreso">${money(costoAlim)}</td><td class="td-egreso">${money(otrosM)}</td><td class="${repos>0?'td-egreso':''}">${tasaR>0?money(repos):'—'}</td><td class="td-egreso">${money(egOp)}</td><td class="${fl>=0?'pos':'td-neg'}">${money(fl)}</td><td class="${flujoAcum<0?'td-neg':''}">${money(flujoAcum)}</td></tr>`;
    }
  } else if(esCria){
    el('flujo-nota').textContent='Cada mes refleja costos de caja. Consumo, agua y mortalidad salen de la tabla semanal de crianza.';
    el('flujo-thead').innerHTML='<tr><th>Mes</th><th>Semanas</th><th>Aves vivas</th><th>Alimento kg</th><th>Agua L</th><th>Mortalidad acum.</th><th>Costo alim.</th><th>Otros costos</th><th>Egresos op.</th><th>Ingreso venta</th><th>Flujo neto</th><th>Acumulado</th></tr>';
    const semV=Math.max(14,Math.min(20,n('semanaVentaCria')));
    const mC=Math.ceil(semV/4);
    const totalR=rearingPeriod(p,aves,1,Math.min(semV,17));
    const avesV= semV<=17 ? totalR.alive : liveBirds(aves,p,'rearing',17);
    const ingV=avesV*n('precioVentaRecria'), cAlimT=totalR.feedKg*n('precioAlimentoCria'), depreCiclo=depre*mC;
    const margenBrutoCria=ingV-cAlimT-costoAves-otrosM*mC;
    htmlEco=[row('Pollitas compradas',`${num(aves)}`), row(`Aves en semana ${semV}`,`${num(avesV,0)}`), row('Mortalidad acumulada recría',`${num(totalR.mort,2)}%`), row('Alimento total recría',`${num(totalR.feedKg,0)} kg`), row('Agua total recría',`${num(totalR.waterL,0)} L`), outRow('Costo compra pollitas',money(costoAves)), outRow('Costo alimento total recría',money(cAlimT)), outRow('Costo equipamiento inicial',money(costoEquip)), outRow('Depreciación mensual infraestructura',money(depre)), outRow(`Depreciación asignada al ciclo (${mC} meses)`,money(depreCiclo)), row('Ingreso estimado por venta',money(ingV)), row('Margen bruto estimado antes de depreciación',money(margenBrutoCria),negClass(margenBrutoCria)), row('Resultado estimado después de depreciación',money(margenBrutoCria-depreCiclo),negClass(margenBrutoCria-depreCiclo))].join('');
    for(let m=1;m<=meses;m++){
      const si=(m-1)*4+1, sf=Math.min(m*4,semV,17);
      if(si>semV || si>17){flujoHTML+=`<tr><td>${m}</td><td colspan="11" style="text-align:center;color:var(--muted);font-size:.75rem;">Ciclo finalizado en semana ${semV}</td></tr>`;break;}
      const rm=rearingPeriod(p,aves,si,sf); const costoAlim=rm.feedKg*n('precioAlimentoCria'); const egOp=costoAlim+otrosM; const esUlt=sf>=Math.min(semV,17); const ing=esUlt?rm.alive*n('precioVentaRecria'):0; const fl=ing-egOp;
      flujoAcum+=fl; if(flujoAcum<peorAcum)peorAcum=flujoAcum; if(mesRecup===null&&flujoAcum>=0)mesRecup=m;
      const cls=mesRecup===m?'recuperado':fl<0?'flujo-neg':'';
      flujoHTML+=`<tr class="${cls}"><td>${m}</td><td>${si}–${sf}</td><td>${num(rm.alive,0)}</td><td>${num(rm.feedKg,0)}</td><td>${num(rm.waterL,0)}</td><td>${num(rm.mort,2)}%</td><td class="td-egreso">${money(costoAlim)}</td><td class="td-egreso">${money(otrosM)}</td><td class="td-egreso">${money(egOp)}</td><td>${esUlt?money(ing):'—'}</td><td class="${fl>=0?'pos':'td-neg'}">${money(fl)}</td><td class="${flujoAcum<0?'td-neg':''}">${money(flujoAcum)}</td></tr>`;
    }
  }

  el('tabla-flujo').innerHTML=flujoHTML;
  el('tabla-economia').innerHTML=htmlEco;
  const capT=Math.max(0,-peorAcum-inversion);
  const ctBox=el('capital-trabajo-box');
  if(capT>0){ctBox.style.display='block';ctBox.innerHTML=`<strong>Capital de trabajo adicional:</strong> ${money(capT)}<br><span style="font-size:.78rem;">Liquidez total requerida: ${money(inversion+capT)}.</span>`;} else ctBox.style.display='none';
  el('aviso-costos-cero').style.display=otrosM===0?'block':'none';

  const obs=[];
  sourceWarnings(p).forEach(t=>obs.push({dot:'ok',txt:t}));
  if(modoActual==='postura'){
    const pm1=productionMonth(p,aves,1);
    obs.push({dot:'',txt:`Mes 1 usa semanas ${pm1.weekStart}–${pm1.weekEnd}; postura promedio calculada con media entre valor bajo y alto.`});
    obs.push({dot:'',txt:`Consumo mes 1: ${num(pm1.feedKg,0)} kg de alimento y ${num(pm1.waterL,0)} L de agua.`});
  } else if(esCria){
    obs.push({dot:'',txt:`Ciclo de cría hasta semana ${n('semanaVentaCria')}: sin ingresos hasta el mes de venta. La inversión incluye compra de pollitas, equipamiento e infraestructura.`});
  }
  if(otrosM===0)obs.push({dot:'warn',txt:'Mano de obra y otros costos en cero. El flujo real será peor — incluye al menos agua, luz, sanidad, empaques y transporte.'});
  if(mesRecup!==null)obs.push({dot:'ok',txt:`El flujo acumulado se vuelve positivo en el mes ${mesRecup} con los valores ingresados.`}); else obs.push({dot:'warn',txt:`En los ${meses} meses proyectados el flujo acumulado no recupera la inversión.`});
  if(capT>0)obs.push({dot:'warn',txt:`Liquidez total requerida: ${money(inversion+capT)} (inversión inicial + capital de trabajo).`});
  el('observaciones').innerHTML=obs.map(o=>`<div class="obs-item"><div class="obs-dot ${o.dot}"></div><div>${o.txt}</div></div>`).join('');
}

document.querySelectorAll('.modo-btn').forEach(b=>b.addEventListener('click',()=>setModo(b.dataset.modo)));
document.querySelectorAll('input,select').forEach(i=>{i.addEventListener('input',calcular);i.addEventListener('change',calcular);});
setModo('postura');
