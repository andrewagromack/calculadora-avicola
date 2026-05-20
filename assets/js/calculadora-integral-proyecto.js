const CONSUMO_CRIA_CAFE   = [10,18,28,36,44,52,58,64,68,72,76,80,84,88,92,96,100];
const CONSUMO_CRIA_BLANCO = [10,17,26,34,42,49,55,60,64,68,72,75,78,81,84,87,90];
const MORT_CRIA=0.003, MORT_POS=0.005, DIAS_MES=30.4, SEMS_RECRIA=17;

const CURVAS={
  hyline_brown:{nombre:'Hy-Line Brown',tipo:'Huevo café',esAprox:false,
    consumoPosturaG:115,aguaRatio:1.8,consumoCriaArr:CONSUMO_CRIA_CAFE,
    espacio:{piso:0.10,jaula:0.055,semi:0.25},espacioCria:0.06,
    comederoCm:10,avesPorTolva:30,avesPorNipple:8,avesPorCampana:80,bebederoCm:10,avesPorNido:5,
    posturaProm:92,posturaPico:96,semanaPelecha:72,
    posturaCurva:[62,92,95,95,94,93,91,89,86,83,79,74,71,68,64,60,57,54,50,47,44,41,38,35]},
  lohmann_brown:{nombre:'Lohmann Brown',tipo:'Huevo café',esAprox:true,
    consumoPosturaG:115,aguaRatio:1.8,consumoCriaArr:CONSUMO_CRIA_CAFE,
    espacio:{piso:0.10,jaula:0.055,semi:0.25},espacioCria:0.06,
    comederoCm:10,avesPorTolva:30,avesPorNipple:8,avesPorCampana:80,bebederoCm:10,avesPorNido:5,
    posturaProm:92,posturaPico:96,semanaPelecha:72,
    posturaCurva:[60,91,94,95,94,92,90,88,85,82,78,74,70,67,63,59,56,53,50,47,44,41,38,35]},
  hyline_w36:{nombre:'Hy-Line W-36',tipo:'Huevo blanco',esAprox:false,
    consumoPosturaG:100,aguaRatio:1.8,consumoCriaArr:CONSUMO_CRIA_BLANCO,
    espacio:{piso:0.09,jaula:0.045,semi:0.22},espacioCria:0.055,
    comederoCm:10,avesPorTolva:30,avesPorNipple:8,avesPorCampana:80,bebederoCm:10,avesPorNido:5,
    posturaProm:93,posturaPico:97,semanaPelecha:74,
    posturaCurva:[64,93,96,96,95,94,92,90,87,84,80,76,73,69,66,62,58,55,52,49,46,43,40,37]},
  lohmann_lsl:{nombre:'Lohmann LSL',tipo:'Huevo blanco',esAprox:true,
    consumoPosturaG:100,aguaRatio:1.8,consumoCriaArr:CONSUMO_CRIA_BLANCO,
    espacio:{piso:0.09,jaula:0.045,semi:0.22},espacioCria:0.055,
    comederoCm:10,avesPorTolva:30,avesPorNipple:8,avesPorCampana:80,bebederoCm:10,avesPorNido:5,
    posturaProm:93,posturaPico:97,semanaPelecha:74,
    posturaCurva:[63,92,96,96,95,93,91,89,86,83,79,75,72,68,65,61,58,54,51,48,45,42,39,36]}
};

let modoActual='postura';
let currentEquipItems=[];
let lastEquipSignature='';
const el=id=>document.getElementById(id);
const n=id=>Number(el(id)?.value||0);
const v=id=>el(id)?.value||'';

function money(val){
  const m=v('moneda'),d=(m==='CLP'||m==='COP')?0:2;
  return new Intl.NumberFormat('es-CL',{style:'currency',currency:m||'USD',
    minimumFractionDigits:d,maximumFractionDigits:d}).format(isFinite(val)?val:0);
}
function num(val,d=0){
  return new Intl.NumberFormat('es-CL',{minimumFractionDigits:d,maximumFractionDigits:d}).format(isFinite(val)?val:0);
}
function row(l,v2){return`<tr><td>${l}</td><td>${v2}</td></tr>`;}
function consumoCriaKgAve(p,s1,s2){
  let kg=0;for(let s=s1;s<=s2;s++){const i=Math.min(s-1,p.consumoCriaArr.length-1);kg+=p.consumoCriaArr[i]*7/1000;}return kg;
}

function setModo(modo){
  modoActual=modo;
  document.querySelectorAll('.modo-btn').forEach(b=>b.classList.toggle('active',b.dataset.modo===modo));
  const esCria=modo==='cria',esPos=modo==='postura',esComp=modo==='completo';
  function fc(id,show){const e=el(id);if(e)e.classList.toggle('on',show);}
  fc('f-precio-gallina',esPos||esComp);
  fc('f-precio-pollita',esCria||esComp);
  fc('f-precio-venta-recria',esCria);
  fc('f-semana-venta',esCria);
  fc('f-precio-huevo',esPos||esComp);
  fc('f-alimento-postura',esPos||esComp);
  fc('f-alimento-cria',esCria||esComp);
  fc('f-reposicion',esPos||esComp);
  if(esComp){el('lbl-gallina').textContent='Valor pollona salida recría (ref. interna)';el('hint-gallina').textContent='Costo de transferencia entre recría y postura.';}
  else{el('lbl-gallina').textContent='Precio gallina lista para postura';el('hint-gallina').textContent='Ave en semana 17–18, lista para iniciar postura.';}
  const p=CURVAS[v('curva')];
  if(esPos)el('hint-meses').textContent=`Postura hasta pelecha: ~${p.posturaCurva.length} meses (sem. ${p.semanaPelecha}).`;
  else if(esCria)el('hint-meses').textContent='Recría: ~4–5 meses hasta semana de venta.';
  else el('hint-meses').textContent=`Ciclo completo: ~4 meses recría + ~${p.posturaCurva.length} meses postura.`;
  calcular();
}

function renderEquip(aves,p,esCria){
  const tc=v('tipoComedero'),tb=v('tipoBebedero');
  const list=el('equip-list');list.innerHTML='';
  const items=[];

  if(!esCria){
    let qtyLabel,pId,pDefault,pLabel,calc;
    if(tc==='tolva'){const u=Math.ceil(aves/p.avesPorTolva);qtyLabel=`${num(u)} tolvas / comederos cilíndricos`;pId='p-comedero';pDefault=18;pLabel='Precio por tolva';calc=()=>u*n('p-comedero');}
    else{const m2=aves*p.comederoCm/100;qtyLabel=`${num(m2,1)} metros lineales`;pId='p-comedero';pDefault=12;pLabel='Precio por metro lineal';calc=()=>m2*n('p-comedero');}
    items.push({emoji:'🍽️',name:'Comederos',qty:qtyLabel,
      why:tc==='tolva'?`1 tolva cada ${p.avesPorTolva} aves.`:`${p.comederoCm} cm de borde por ave.`,
      pId,pLabel,pDefault,calc});
  }

  {let qtyLabel,pId,pDefault,pLabel,calc,why;
    if(tb==='nipple'){const u=Math.ceil(aves/p.avesPorNipple);qtyLabel=`${num(u)} nipples / chupetes`;pId='p-bebedero';pDefault=1.20;pLabel='Precio por nipple';calc=()=>u*n('p-bebedero');why=`1 nipple cada ${p.avesPorNipple} aves.`;}
    else if(tb==='campana'){const u=Math.ceil(aves/p.avesPorCampana);qtyLabel=`${num(u)} campanas / cazoletas`;pId='p-bebedero';pDefault=25;pLabel='Precio por campana';calc=()=>u*n('p-bebedero');why=`1 campana cada ${p.avesPorCampana} aves.`;}
    else{const m2=aves*p.bebederoCm/100;qtyLabel=`${num(m2,1)} metros lineales de canal`;pId='p-bebedero';pDefault=10;pLabel='Precio por metro lineal';calc=()=>m2*n('p-bebedero');why=`${p.bebederoCm} cm de canal por ave.`;}
    items.push({emoji:'💧',name:'Bebederos',qty:qtyLabel,why,pId,pLabel,pDefault,calc});
  }

  if(!esCria){
    const u=Math.ceil(aves/p.avesPorNido);
    items.push({emoji:'🪹',name:'Nidos',qty:`${num(u)} nidos`,
      why:`1 nido cada ${p.avesPorNido} gallinas.`,
      pId:'p-nido',pLabel:'Precio por nido',pDefault:15,calc:()=>u*n('p-nido')});
  }

  items.forEach(item=>{
    const prevVal=el(item.pId)?.value??item.pDefault;
    const div=document.createElement('div');
    div.className='equip-item';
    div.innerHTML=`
      <div class="equip-left">
        <div class="equip-emoji">${item.emoji}</div>
        <div class="equip-body">
          <div class="equip-name">${item.name}</div>
          <div class="equip-qty">Necesitas: ${item.qty}</div>
          <div class="equip-why">${item.why}</div>
        </div>
      </div>
      <div class="equip-right">
        <label for="${item.pId}">${item.pLabel}</label>
        <input type="number" id="${item.pId}" value="${prevVal}" min="0" step="0.1">
        <div class="equip-subtotal" id="${item.pId}-sub">—</div>
      </div>`;
    list.appendChild(div);
    el(item.pId).addEventListener('input',calcular);
    el(item.pId).addEventListener('change',calcular);
  });
  return items;
}

function calcular(){
  const aves=Math.max(1,n('aves'));
  const p=CURVAS[v('curva')];
  const sistema=v('sistema');
  const meses=Math.min(36,Math.max(1,n('meses')));
  const otrosM=n('manoObra')+n('otrosMensuales');
  const tasaR=n('tasaReposicion')/100;
  const esCria=modoActual==='cria';

  const areaPos=aves*p.espacio[sistema];
  const area=esCria?aves*p.espacioCria:areaPos;

  const equipSignature=[modoActual,aves,v('curva'),v('tipoComedero'),v('tipoBebedero')].join('|');
  const items=(equipSignature===lastEquipSignature)
    ? currentEquipItems
    : (lastEquipSignature=equipSignature,currentEquipItems=renderEquip(aves,p,esCria));
  let costoEquip=0;
  items.forEach(item=>{
    const c=item.calc();costoEquip+=c;
    const sub=el(`${item.pId}-sub`);
    if(sub)sub.textContent=n(item.pId)>0?`Subtotal: ${money(c)}`:'—';
  });

  const costoInfraM2=area*n('costoM2');
  const costoInfraFijo=n('infraExtra');
  const costoInfra=costoInfraM2+costoInfraFijo;
  const depre=costoInfra/Math.max(1,n('vidaUtilInfra'));

  el('infra-resumen').innerHTML=`
    <div class="infra-item">
      <div class="infra-item-name">Construcción del gallinero</div>
      <div class="infra-item-val">${num(area,1)} m² × ${money(n('costoM2'))}/m² = ${money(costoInfraM2)}</div>
      <div class="infra-item-hint">Área calculada para ${num(aves)} aves en sistema ${sistema==='piso'?'piso/cama':sistema==='jaula'?'jaula':'semi-pastoreo'}.</div>
    </div>
    <div class="infra-item">
      <div class="infra-item-name">Otros costos de infraestructura</div>
      <div class="infra-item-val">${money(costoInfraFijo)}</div>
      <div class="infra-item-hint">Depreciación estimada: ${money(depre)}/mes sobre ${n('vidaUtilInfra')} meses.</div>
    </div>`;

  let costoAves=modoActual==='postura'?aves*n('precioAvePostura'):aves*n('precioPollita');
  const inversion=costoAves+costoInfra+costoEquip;

  el('k-aves').textContent=num(aves);
  el('k-area').textContent=`${num(area,1)} m²`;
  el('k-inversion').textContent=money(inversion);
  el('total-inversion').textContent=money(inversion);
  if(esCria){el('k-alim-label').textContent='Alimento / día';el('k-alim-sub').textContent='Semana 17 recría';el('k-alimento').textContent=`${num(p.consumoCriaArr[SEMS_RECRIA-1]*aves/1000,1)} kg`;}
  else{el('k-alim-label').textContent='Alimento / mes';el('k-alim-sub').textContent='Postura (día 1)';el('k-alimento').textContent=`${num(aves*p.consumoPosturaG/1000*DIAS_MES,0)} kg`;}

  let flujoHTML='',flujoAcum=-inversion,peorAcum=-inversion,mesRecup=null,htmlEco='';

  if(modoActual==='postura'){
    el('flujo-nota').textContent='La inversión inicial se descuenta desde el mes 1. El alimento baja mes a mes con la mortalidad acumulada.';
    el('flujo-thead').innerHTML='<tr><th>Mes</th><th>Aves</th><th>Postura</th><th>Huevos</th><th>Ingresos</th><th>Egresos op.</th><th>Repos.</th><th>Flujo neto</th><th>Acumulado</th></tr>';
    const alimM1=aves*p.consumoPosturaG/1000*DIAS_MES,post1=p.posturaCurva[0],huev1=aves*(post1/100)*DIAS_MES;
    const ing1=huev1*n('precioHuevo'),egrAlim1=alimM1*n('precioAlimentoPostura'),egrOp1=egrAlim1+otrosM;
    const cH=huev1>0?egrOp1/huev1:0,cHD=huev1>0?(egrOp1+depre)/huev1:0;
    htmlEco=[row('Postura esperada mes 1',`${num(post1,1)}%`),row('Huevos esperados mes 1',`${num(huev1,0)} unidades`),
      row('Docenas mes 1',`${num(huev1/12,0)}`),row('Ingreso estimado mes 1',money(ing1)),
      row('Costo alimento mes 1',money(egrAlim1)),row('Otros costos mensuales',money(otrosM)),
      row('Costo operativo por huevo (mes 1)',money(cH)),row('Costo por huevo incl. depreciación infra',money(cHD)),
      row('Precio de venta por huevo',money(n('precioHuevo'))),row('Margen operativo por huevo (mes 1)',money(n('precioHuevo')-cH)),
      row('Flujo operativo mes 1',money(ing1-egrOp1)),row('Depreciación mensual infraestructura',money(depre))].join('');
    let aM=aves;
    for(let m=1;m<=meses;m++){
      if(m>1)aM*=(1-MORT_POS);
      const post=p.posturaCurva[Math.min(m-1,p.posturaCurva.length-1)]/100;
      const huev=aM*post*DIAS_MES,alKg=aM*p.consumoPosturaG/1000*DIAS_MES;
      const ing=huev*n('precioHuevo'),egOp=alKg*n('precioAlimentoPostura')+otrosM;
      const repos=m>1&&tasaR>0?aves*tasaR*n('precioAvePostura'):0;
      const fl=ing-egOp-repos;
      flujoAcum+=fl;if(flujoAcum<peorAcum)peorAcum=flujoAcum;
      if(mesRecup===null&&flujoAcum>=0)mesRecup=m;
      const cls=mesRecup===m?'recuperado':fl<0?'flujo-neg':'';
      flujoHTML+=`<tr class="${cls}"><td>${m}</td><td>${num(aM,0)}</td><td>${num(post*100,1)}%</td><td>${num(huev,0)}</td><td>${money(ing)}</td><td>${money(egOp)}</td><td>${tasaR>0?money(repos):'—'}</td><td class="${fl>=0?'pos':''}">${money(fl)}</td><td>${money(flujoAcum)}</td></tr>`;
    }
  } else if(esCria){
    el('flujo-nota').textContent='Cada mes refleja el costo de alimento de crecimiento. El ingreso aparece en el mes en que se venden las pollonas.';
    el('flujo-thead').innerHTML='<tr><th>Mes</th><th>Sem. prom.</th><th>Aves vivas</th><th>Alimento kg</th><th>Egresos op.</th><th>Ingreso venta</th><th>Flujo neto</th><th>Acumulado</th></tr>';
    const semV=Math.max(14,Math.min(20,n('semanaVentaCria')));
    let avesV=aves;for(let s=1;s<=semV;s++)avesV*=(1-MORT_CRIA);
    const ingV=avesV*n('precioVentaRecria'),alimTK=consumoCriaKgAve(p,1,semV)*aves,cAlimT=alimTK*n('precioAlimentoCria');
    const mC=Math.ceil(semV/4.3);
    htmlEco=[row('Pollitas compradas',`${num(aves)}`),row(`Aves en semana ${semV}`,`${num(avesV,0)}`),
      row('Mortalidad acumulada recría',`${num((1-avesV/aves)*100,1)}%`),row('Alimento total recría',`${num(alimTK,0)} kg`),
      row('Costo alimento total recría',money(cAlimT)),row('Ingreso estimado por venta',money(ingV)),
      row('Margen bruto estimado',money(ingV-cAlimT-costoAves-otrosM*mC))].join('');
    avesV=aves;
    for(let m=1;m<=meses;m++){
      const si=(m-1)*4+1,sf=Math.min(m*4,semV);
      if(si>semV){flujoHTML+=`<tr><td>${m}</td><td colspan="7" style="text-align:center;color:var(--muted);font-size:.75rem;">Ciclo finalizado en semana ${semV}</td></tr>`;break;}
      for(let s=0;s<sf-si+1;s++)avesV*=(1-MORT_CRIA);
      let alKg=0;for(let s=si;s<=sf;s++){const i=Math.min(s-1,p.consumoCriaArr.length-1);alKg+=p.consumoCriaArr[i]*7*avesV/1000;}
      const egOp=alKg*n('precioAlimentoCria')+otrosM,esUlt=sf>=semV;
      const ing=esUlt?avesV*n('precioVentaRecria'):0,fl=ing-egOp;
      flujoAcum+=fl;if(flujoAcum<peorAcum)peorAcum=flujoAcum;
      if(mesRecup===null&&flujoAcum>=0)mesRecup=m;
      const cls=mesRecup===m?'recuperado':fl<0?'flujo-neg':'';
      const sp=Math.round((si+sf)/2);
      flujoHTML+=`<tr class="${cls}"><td>${m}</td><td>${sp}</td><td>${num(avesV,0)}</td><td>${num(alKg,0)}</td><td>${money(egOp)}</td><td>${esUlt?money(ing):'—'}</td><td class="${fl>=0?'pos':''}">${money(fl)}</td><td>${money(flujoAcum)}</td></tr>`;
    }
  } else {
    el('flujo-nota').textContent='Fase ámbar = recría (sin ingresos). Fase verde = postura según curva técnica.';
    el('flujo-thead').innerHTML='<tr><th>Mes</th><th>Fase</th><th>Aves</th><th>Postura/Sem.</th><th>Huevos/Alim.</th><th>Ingresos</th><th>Egresos op.</th><th>Flujo neto</th><th>Acumulado</th></tr>';
    const mC=Math.ceil(SEMS_RECRIA/4.3);let avesA=aves;
    for(let m=1;m<=meses;m++){
      const esC=m<=mC;let fl=0,ing=0,egOp=0;
      if(esC){
        const si=(m-1)*4+1,sf=Math.min(m*4,SEMS_RECRIA);
        for(let s=0;s<sf-si+1;s++)avesA*=(1-MORT_CRIA);
        let alKg=0;for(let s=si;s<=sf;s++){const i=Math.min(s-1,p.consumoCriaArr.length-1);alKg+=p.consumoCriaArr[i]*7*avesA/1000;}
        egOp=alKg*n('precioAlimentoCria')+otrosM;fl=-egOp;
        const sp=Math.round((si+Math.min(m*4,SEMS_RECRIA))/2);
        flujoHTML+=`<tr class="flujo-neg"><td>${m}</td><td class="fase-cria">Recría</td><td>${num(avesA,0)}</td><td>Sem. ${sp}</td><td>${num(alKg,0)} kg</td><td>—</td><td>${money(egOp)}</td><td>${money(fl)}</td><td>${money(flujoAcum+fl)}</td></tr>`;
      } else {
        if(m>1)avesA*=(1-MORT_POS);
        const idx=Math.min(m-mC-1,p.posturaCurva.length-1);
        const post=p.posturaCurva[idx]/100,huev=avesA*post*DIAS_MES;
        const alKg=avesA*p.consumoPosturaG/1000*DIAS_MES;
        ing=huev*n('precioHuevo');
        const repos=tasaR>0?aves*tasaR*n('precioAvePostura'):0;
        egOp=alKg*n('precioAlimentoPostura')+otrosM+repos;fl=ing-egOp;
        const cls=fl<0?'flujo-neg':'';
        flujoHTML+=`<tr class="${cls}"><td>${m}</td><td class="fase-pos">Postura</td><td>${num(avesA,0)}</td><td>${num(post*100,1)}%</td><td>${num(huev,0)} huevos</td><td>${money(ing)}</td><td>${money(egOp)}</td><td class="${fl>=0?'pos':''}">${money(fl)}</td><td>${money(flujoAcum+fl)}</td></tr>`;
      }
      flujoAcum+=fl;if(flujoAcum<peorAcum)peorAcum=flujoAcum;
      if(mesRecup===null&&flujoAcum>=0)mesRecup=m;
    }
    const avIP=aves*Math.pow(1-MORT_CRIA,SEMS_RECRIA),post1=p.posturaCurva[0]/100;
    const huev1=avIP*post1*DIAS_MES,ing1=huev1*n('precioHuevo');
    const eg1=avIP*p.consumoPosturaG/1000*DIAS_MES*n('precioAlimentoPostura')+otrosM;
    const cH1=huev1>0?eg1/huev1:0;
    const alCT=consumoCriaKgAve(p,1,SEMS_RECRIA)*aves*n('precioAlimentoCria');
    htmlEco=[row('Pollitas compradas',`${num(aves)}`),row('Aves al inicio de postura (est.)',`${num(avIP,0)}`),
      row('Costo alimento recría total',money(alCT)),row('Postura primer mes productivo',`${num(post1*100,1)}%`),
      row('Huevos primer mes productivo',`${num(huev1,0)}`),row('Ingreso primer mes productivo',money(ing1)),
      row('Costo op. por huevo (primer mes postura)',money(cH1)),
      row('Margen por huevo (primer mes postura)',money(n('precioHuevo')-cH1)),
      row('Depreciación mensual infraestructura',money(depre))].join('');
  }

  el('tabla-flujo').innerHTML=flujoHTML;
  el('tabla-economia').innerHTML=htmlEco;

  const capT=Math.max(0,-peorAcum-inversion);
  const ctBox=el('capital-trabajo-box');
  if(capT>0){ctBox.style.display='block';ctBox.innerHTML=`<strong>Capital de trabajo adicional:</strong> ${money(capT)}<br><span style="font-size:.78rem;">Liquidez total requerida: ${money(inversion+capT)}.</span>`;}
  else ctBox.style.display='none';

  el('aviso-costos-cero').style.display=otrosM===0?'block':'none';

  const obs=[];
  if(p.esAprox)obs.push({dot:'warn',txt:`La curva ${p.nombre} es una aproximación conservadora, no datos oficiales del fabricante.`});
  if(modoActual==='postura'){
    obs.push({dot:'',txt:`Para ${num(aves)} aves en sistema ${sistema==='piso'?'piso/cama profunda':sistema==='jaula'?'jaula':'semi-pastoreo'} necesitas al menos ${num(areaPos,1)} m² útiles.`});
    obs.push({dot:'',txt:`Consumo de alimento mes 1: ${num(aves*p.consumoPosturaG/1000*DIAS_MES,0)} kg. Es el principal costo — verifica el precio local.`});
  } else if(esCria){
    obs.push({dot:'',txt:`Ciclo de cría hasta semana ${n('semanaVentaCria')}: sin ingresos hasta el mes de venta. Asegúrate de tener el capital disponible.`});
  } else {
    obs.push({dot:'',txt:`Ciclo completo: los primeros ~4 meses son recría sin ingresos. El flujo acumulado tarda más en recuperarse que en modo solo postura.`});
  }
  if(otrosM===0)obs.push({dot:'warn',txt:'Mano de obra y otros costos en cero. El flujo real será peor — incluye al menos agua, luz, sanidad, empaques y transporte.'});
  if(mesRecup!==null)obs.push({dot:'ok',txt:`El flujo acumulado se vuelve positivo en el mes ${mesRecup} con los valores ingresados.`});
  else obs.push({dot:'warn',txt:`En los ${meses} meses proyectados el flujo acumulado no recupera la inversión.`});
  if(capT>0)obs.push({dot:'warn',txt:`Liquidez total requerida: ${money(inversion+capT)} (inversión inicial + capital de trabajo).`});
  if(modoActual!=='cria'&&tasaR===0)obs.push({dot:'',txt:`Sin reposición activa: el stock productivo baja ${(MORT_POS*100).toFixed(1)}% cada mes.`});
  el('observaciones').innerHTML=obs.map(o=>`<div class="obs-item"><div class="obs-dot ${o.dot}"></div><div>${o.txt}</div></div>`).join('');
}

document.querySelectorAll('.modo-btn').forEach(b=>b.addEventListener('click',()=>setModo(b.dataset.modo)));
document.querySelectorAll('input,select').forEach(i=>{i.addEventListener('input',calcular);i.addEventListener('change',calcular);});
setModo('postura');
