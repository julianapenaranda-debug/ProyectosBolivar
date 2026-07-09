#!/usr/bin/env node
/** Genera docs/portafolio-proyectos.html V3. Run: node scripts/generate-portfolio-v3.js */
const fs=require('fs'),path=require('path');
const JIRA='https://jirasegurosbolivar.atlassian.net/browse';
const TODAY=new Date();
const TODAY_STR=TODAY.toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});
// Datos de Iniciativa 2026 (fuente oficial del semáforo consolidado)
// [id, code, name, ini_key, ini_duedate]
const INI=[
['gd902','GD-902','PRY Transformación de Suscripción (Motor suscripción)','GD902-533','2026-12-30'],
['gd903','GD-903','PRY Autogestión Pólizas Individuales (Simon ventas)','GD903-246','2026-12-31'],
['gd905','GD-905','PRY Carpeta Única de Cliente','GD905-38','2026-09-30'],
['gd907','GD-907','Unificación de Plataformas','GD907-613','2026-12-31'],
['gd929','GD-929','PRY Gestión en Bienestar - Autorizaciones ARL/Salud','GD929-716','2026-12-31'],
['gd971','GD-971','Ciber 5.0 WAPP Multinube','GD971-42','2026-03-31'],
['gd976','GD-976','Ciber 5.0 SSE (Security Service Edge)','GD976-48','2026-07-23'],
['gd981','GD-981','Plataforma Cumplimiento Autogestión 0-500M','GD981-1037','2026-12-31'],
['gd1130','GD-1130','PRY Cuentas Médicas','GD1130-75','2026-11-09'],
['gd1136','GD-1136','Migración e Implementación Bizagi / BPMS','GD1136-18','2026-12-31'],
['gd1141','GD-1141','PRY Access Policy Management (APM)','GD1141-3','2026-08-31'],
['gd904','GD-904','PRY Transformación de Indemnizaciones','GD904-509','2026-12-31']
];
function iniSem(pctDone,due){
  // Duedate de iniciativa vencida = rojo
  if(due&&new Date(due)<TODAY)return 'rojo';
  // % Completitud (Hecho+Cancel/Total)
  if(pctDone>=60)return 'verde';
  if(pctDone>=30)return 'amarillo';
  if(pctDone>0)return 'rojo';
  return 'gris';
}
const P=[
{id:'gd902',c:'GD-902',n:'PRY Transformación de Suscripción (Motor suscripción)',e:[
['GD902-534','Extracción reglas tronador','prog','2026-06-30'],
['GD902-535','Creación APIS motor','prog','2026-12-29'],
['GD902-536','Mejoras Filenet','hecho','2026-12-29','2026-01-30'],
['GD902-825','MR Desarrollo bases técnicas','prog','2026-06-30'],
['GD902-834','MR Gestión Accesos Seguridad','prog','2026-07-31'],
['GD902-839','MR Dashboard activación rol','hecho','2026-05-31','2026-06-05'],
['GD902-844','MR Config Reglas Lenguaje Natural','hecho','2026-05-31','2026-05-29'],
['GD902-910','MR Vigencia reglas','hecho','2026-05-31','2026-05-29'],
['GD902-923','MR Aseguramiento Calidad','hecho','2026-05-31','2026-05-29'],
['GD902-932','MR Ejecución Simulación','hecho','2026-05-31','2026-05-29'],
['GD902-937','MR Tablero Gestión Reglas','hecho','2026-05-31','2026-05-29'],
['GD902-940','MR Consulta Trazabilidad','hecho','2026-06-30','2026-06-24'],
['GD902-947','MR Edición activar inactivar','hecho','2026-05-31','2026-05-29'],
['GD902-960','Registro Evidencia','prog','2026-06-30'],
['GD902-969','MR Modulo reportería','prog','2026-06-30'],
['GD902-982','MR Registro Evidencia','hecho','2026-06-30','2026-06-24'],
['GD902-995','MR Exportación reportes','hecho','2026-06-30','2026-06-24'],
['GD902-1004','MR Restaurar regla','prog','2026-06-30'],
['GD902-1009','MR Config Alertas','prog','2026-06-30'],
['GD902-1018','MR envío notificaciones','prog','2026-06-30'],
['GD902-1310','Ajustes Evolutivos','porhacer',null]]},
{id:'gd903',c:'GD-903',n:'PRY Autogestión Pólizas Individuales (Simon ventas)',e:[
['GD903-42','Autos Cotización y Emisión','prog','2026-07-31'],
['GD903-310','Vida Cotización y Emisión','porhacer',null],
['GD903-321','Autos Migración Angular 17+','porhacer',null],
['GD903-402','Autos Modificaciones Autogestión','porhacer',null],
['GD903-403','Vida Modificaciones','porhacer',null],
['GD903-404','Salud Modificaciones','porhacer',null],
['GD903-405','Hogar Modificaciones','porhacer',null],
['GD903-406','Módulo Consulta Cotizaciones','porhacer',null],
['GD903-407','Salud Cotización y Emisión','porhacer',null],
['GD903-408','Unificación Firma Electrónica','porhacer',null],
['GD903-409','Hogar Cotización y Emisión','porhacer',null]]},
{id:'gd905',c:'GD-905',n:'PRY Carpeta Única de Cliente',e:[
['GD905-39','Módulo parametrización docs','prog','2026-06-30'],
['GD905-44','Integración gestor documental','prog','2026-05-31'],
['GD905-49','API componente integraciones','hecho','2026-06-01','2026-05-14'],
['GD905-98','Config inicial proyecto','hecho','2026-12-31','2026-02-27'],
['GD905-103','Pantalla Gestión Config','hecho','2026-06-01','2026-06-11'],
['GD905-108','Visualización tablas','hecho','2026-06-01','2026-05-11'],
['GD905-113','Creación documentos','hecho','2026-06-01','2026-06-11'],
['GD905-114','Editar información','hecho','2026-06-01','2026-06-11'],
['GD905-119','Cargar masivamente','hecho','2026-06-01','2026-06-11'],
['GD905-120','Creación datos','hecho','2026-06-01','2026-06-11'],
['GD905-121','Validación y edición','hecho','2026-06-01','2026-06-11'],
['GD905-122','Admin Módulo Procesos','hecho','2026-06-01','2026-06-11'],
['GD905-127','Creación subprocesos','hecho','2026-06-01','2026-06-11'],
['GD905-132','Editar subprocesos','hecho','2026-06-01','2026-06-11'],
['GD905-137','Admin edición proceso','hecho','2026-06-01','2026-06-11'],
['GD905-142','Trazabilidad y Auditoría','hecho','2026-06-01','2026-06-11'],
['GD905-259','Visualización docs operación','cancel','2026-06-01','2026-04-27'],
['GD905-261','Creación OCR y API','prog','2026-10-31'],
['GD905-262','Gestión vigencias','cancel','2026-06-01','2026-05-22'],
['GD905-264','Creación caso workflow','cancel','2026-06-01','2026-04-27'],
['GD905-390','Evolutivos CUC Oleary','porhacer','2026-10-31']]},
{id:'gd907',c:'GD-907',n:'Unificación de Plataformas',e:[
['GD907-26','Autoservicio empleados','prog','2026-12-31'],
['GD907-27','Autogestión datos','prog','2026-12-31'],
['GD907-620','Ajustes vulnerabilidades IDOR','porhacer',null],
['GD907-631','Ajustes Portal Migración','hecho',null,'2026-03-31'],
['GD907-651','Implementación Tags','prog',null],
['GD907-658','Modal Informativo Admin','prog',null],
['GD907-664','Migración módulo GH','porhacer',null],
['GD907-901','Desarrollos backend Sagui','porhacer',null]]},
{id:'gd929',c:'GD-929',n:'PRY Gestión en Bienestar - Autorizaciones ARL/Salud',e:[
['GD929-729','Despliegue prioridad 1','prog','2026-12-31'],
['GD929-1395','Despliegue prioridad 2','prog','2026-07-09'],
['GD929-1396','Despliegue prioridad 3','prog','2026-08-14'],
['GD929-1688','Automatización pruebas','porhacer',null]]},
{id:'gd971',c:'GD-971',n:'Ciber 5.0 WAPP Multinube',e:[
['GD971-43','Kickoff proveedor','hecho','2026-01-19'],
['GD971-44','Requisitos','hecho','2026-01-30'],
['GD971-45','Implementación Cloudflare 27 dominios','prog','2026-03-27'],
['GD971-46','Marcha Blanca','prog','2026-07-09'],
['GD971-47','Cierre del proyecto','prog','2026-07-09']]},
{id:'gd976',c:'GD-976',n:'Ciber 5.0 SSE (Security Service Edge)',e:[
['GD976-49','Marcha blanca proyecto','prog','2026-07-23']]},
{id:'gd981',c:'GD-981',n:'Plataforma Cumplimiento Autogestión 0-500M',e:[
['GD981-733','Aplicación automática sobrecomisión','hecho','2026-06-10'],
['GD981-1412','Atención solicitudes email','prog','2026-07-09'],
['GD981-1506','Retoma solicitudes','porhacer','2026-07-22'],
['GD981-1507','Modificación tasa','prog','2026-07-10']]},
{id:'gd1130',c:'GD-1130',n:'PRY Cuentas Médicas',e:[
['GD1130-19','Front radicación facturas','prog','2026-11-09'],
['GD1130-81','Front Gestor Cuentas Médicas','prog','2026-11-09'],
['GD1130-82','Flujo Cuentas Médicas IPS','prog','2026-11-09'],
['GD1130-83','Paramétricas Cuentas Médicas','prog','2026-11-09'],
['GD1130-281','SIIFA Cuentas Médicas - Fase 1','prog',null]]},
{id:'gd1136',c:'GD-1136',n:'Migración e Implementación Bizagi / BPMS',e:[
['GD1136-2','Bizagi Setup cloud','hecho','2026-03-31'],
['GD1136-34','Paquete 1 Radicación','prog','2026-05-08'],
['GD1136-35','Paquete 2 Análisis','prog','2026-05-25'],
['GD1136-36','Paquete 3 Cierre','prog','2026-06-19']]},
{id:'gd1141',c:'GD-1141',n:'PRY Access Policy Management (APM)',e:[
['GD1141-4','Plan Migración Bajos','hecho','2026-05-25'],
['GD1141-11','Migración Producción','hecho','2026-06-30'],
['GD1141-28','Migración APM DRP','prog','2026-07-31']]},
{id:'gd904',c:'GD-904',n:'PRY Transformación de Indemnizaciones',e:[
['GD904-379','MVP Inicial | Habilitar Vida-Renta','hecho','2026-02-28','2026-03-11'],
['GD904-518','Evolutivo | Retomar indemnización multicanal','porhacer',null],
['GD904-633','Evolutivo | Activar botón trazabilidad','porhacer',null],
['GD904-663','Plan contingencia | Automatizar correos','prog','2026-05-15'],
['GD904-683','MVP Inicial | Proceso Pac conversacional','hecho','2025-12-11','2025-12-02'],
['GD904-720','Plan contingencia | Flujo Trabajo Rentas','prog','2026-05-28'],
['GD904-778','Flujo de trabajo Patrimoniales','porhacer',null]]}
];
// Issues bloqueados del portafolio [key, resumen, proyecto, fecha_bloqueo]
const BLOCKED=[
['GD907-621','Blindaje IDOR','GD-907','2026-01-16'],
['GD907-625','Control de Acceso MITM','GD-907','2026-01-16'],
['GD929-805','Validación data exclusiones','GD-929','2026-01-15'],
['GD902-956','Flujo preliquidación cotización','GD-902','2026-04-01'],
['GD981-1276','Implementación Clarity','GD-981','2026-03-27'],
['GD981-1484','Tags monitoreo front','GD-981','2026-04-13'],
['GD981-1491','Encuesta satisfacción Survicate','GD-981','2026-04-13']
];

function isOverdue(d){if(!d)return false;return new Date(d)<TODAY;}
function sem(st,due){
  if(st==='hecho'||st==='cancel')return 'verde';
  if(st==='porhacer')return 'gris';
  if(isOverdue(due))return 'amarillo';
  return 'gris';
}
function bc(v){return v<30?'low':v<=60?'mid':'high';}
function badge(s){
  const m={hecho:'badge-hecho">Hecho',prog:'badge-progreso">En Progreso',porhacer:'badge-porhacer">Por Hacer',cancel:'badge-cancelado">Cancelado'};
  return `<span class="badge ${m[s]||m.porhacer}</span>`;
}
function dueH(d,st){
  if(!d)return '—';
  if(st==='prog'&&isOverdue(d)){const dd=Math.round((TODAY-new Date(d))/864e5);return `<span class="due-vencida">${d} ⚠️ -${dd}d</span>`;}
  return d;
}
function pCols(st,r,p){
  if(st==='hecho'||st==='cancel')return '<td colspan="2" style="text-align:center;color:var(--success);font-weight:600">✓ Completada</td>';
  if(r===0&&p===0)return '<td>—</td><td>—</td>';
  return `<td><div class="progress-bar"><div class="progress-fill ${bc(r)}" style="width:${Math.min(r,100)}%"></div></div>${r.toFixed(1)}%</td><td>${p.toFixed(1)}%</td>`;
}
// Count KPIs
let totH=0,totP=0,totPH=0;
P.forEach(p=>p.e.forEach(e=>{
  const st=e[2];
  if(st==='hecho'||st==='cancel')totH++;else if(st==='prog')totP++;else totPH++;
}));
let iniCritico=0,iniRiesgo=0,iniAdelantado=0,iniSinIniciar=0;
INI.forEach(ini=>{const due=ini[4];
  const p=P.find(x=>x.id===ini[0]);
  let done=0,total=0;
  if(p){p.e.forEach(e=>{total++;if(e[2]==='hecho'||e[2]==='cancel')done++;});}
  const pct=total>0?((done/total)*100):0;
  const sm=iniSem(pct,due);
  if(sm==='verde'){iniAdelantado++;}
  else if(sm==='amarillo'){iniRiesgo++;}
  else if(sm==='rojo'){iniCritico++;}
  else{iniSinIniciar++;}
});
let html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Dashboard Portafolio V3 — GD | Seguros Bolívar</title>
<style>:root{--primary:#1a237e;--primary-light:#283593;--primary-dark:#0d1642;--white:#fff;--gray-50:#f8f9fa;--gray-100:#f1f3f5;--gray-200:#e9ecef;--gray-400:#ced4da;--gray-500:#adb5bd;--gray-600:#868e96;--gray-800:#343a40;--success:#2e7d32;--success-bg:#e8f5e9;--warning:#f57f17;--warning-bg:#fff8e1;--danger:#c62828;--danger-bg:#ffebee;--neutral:#546e7a;--neutral-bg:#eceff1;--font:system-ui,-apple-system,sans-serif;--radius:8px;--shadow:0 2px 8px rgba(26,35,126,.08)}*{margin:0;padding:0;box-sizing:border-box}body{font-family:var(--font);background:var(--gray-50);color:var(--gray-800);line-height:1.5}a{color:var(--primary);text-decoration:none}a:hover{text-decoration:underline}.header{background:linear-gradient(135deg,var(--primary-dark),var(--primary));color:var(--white);padding:2rem 1.5rem;text-align:center}.header h1{font-size:1.75rem;font-weight:700;margin-bottom:.25rem}.header .sub{font-size:1rem;opacity:.85}.header .date{font-size:.85rem;opacity:.7;margin-top:.5rem}.header .vb{display:inline-block;background:rgba(255,255,255,.15);padding:.2rem .6rem;border-radius:12px;font-size:.75rem;margin-top:.5rem}.container{max-width:1400px;margin:0 auto;padding:1.5rem}.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem}.kpi-card{background:var(--white);border-radius:var(--radius);padding:1.25rem;box-shadow:var(--shadow);text-align:center;border-top:3px solid var(--primary)}.kpi-card .v{font-size:2rem;font-weight:700;color:var(--primary)}.kpi-card .l{font-size:.85rem;color:var(--gray-600);margin-top:.25rem}.kpi-card.d{border-top-color:var(--danger)}.kpi-card.d .v{color:var(--danger)}.kpi-card.s{border-top-color:var(--success)}.kpi-card.s .v{color:var(--success)}.kpi-card.w{border-top-color:var(--warning)}.kpi-card.w .v{color:var(--warning)}.st{font-size:1.25rem;font-weight:700;color:var(--primary);margin:2rem 0 1rem;padding-bottom:.5rem;border-bottom:2px solid var(--gray-200)}.tw{overflow-x:auto;background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:2rem}table{width:100%;border-collapse:collapse;font-size:.875rem}thead{background:var(--primary);color:var(--white)}th{padding:.75rem 1rem;text-align:left;font-weight:600;white-space:nowrap}td{padding:.65rem 1rem;border-bottom:1px solid var(--gray-200)}tbody tr:hover{background:var(--gray-100)}.sem{display:inline-block;width:14px;height:14px;border-radius:50%;vertical-align:middle}.sem-rojo{background:var(--danger);box-shadow:0 0 4px rgba(198,40,40,.4)}.sem-amarillo{background:var(--warning);box-shadow:0 0 4px rgba(245,127,23,.4)}.sem-verde{background:var(--success);box-shadow:0 0 4px rgba(46,125,50,.4)}.sem-gris{background:var(--gray-400)}.progress-bar{background:var(--gray-200);border-radius:10px;height:8px;width:100%;min-width:80px;overflow:hidden}.progress-fill{height:100%;border-radius:10px}.progress-fill.low{background:var(--danger)}.progress-fill.mid{background:var(--warning)}.progress-fill.high{background:var(--success)}.badge{display:inline-block;padding:.2rem .6rem;border-radius:12px;font-size:.75rem;font-weight:600;white-space:nowrap}.badge-hecho{background:var(--success-bg);color:var(--success)}.badge-progreso{background:var(--warning-bg);color:var(--warning)}.badge-porhacer{background:var(--neutral-bg);color:var(--neutral)}.badge-cancelado{background:var(--danger-bg);color:var(--danger);text-decoration:line-through}.al{background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);padding:1rem;margin-bottom:2rem}.ai{padding:.5rem .75rem;border-left:4px solid var(--danger);margin-bottom:.5rem;background:var(--danger-bg);border-radius:0 var(--radius) var(--radius) 0;font-size:.85rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem}.ai.aw{border-left-color:var(--warning);background:var(--warning-bg)}.ai .sv{font-weight:700;color:var(--danger);white-space:nowrap}.ai.aw .sv{color:var(--warning)}.ds{background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:1.5rem}.dh{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;padding:1.25rem 1.5rem;cursor:pointer;user-select:none;border-radius:var(--radius)}.dh:hover{background:var(--gray-50)}.dh h3{font-size:1.1rem;color:var(--primary-dark);flex:1}.dh .tg{font-size:1.2rem}.dc{padding:0 1.5rem 1.5rem;display:none}.dc.open{display:block}.due-vencida{color:var(--danger);font-weight:600}.nav-top{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.5rem}.nav-top a{font-size:.8rem;padding:.3rem .6rem;background:var(--gray-100);border-radius:var(--radius)}.footer{text-align:center;padding:2rem 1rem;font-size:.8rem;color:var(--gray-500);border-top:1px solid var(--gray-200);margin-top:2rem}@media(max-width:768px){.header h1{font-size:1.3rem}.kpi-grid{grid-template-columns:repeat(2,1fr)}th,td{padding:.5rem;font-size:.8rem}}</style></head><body>
<header class="header"><h1>Dashboard de Portafolio V3 — Gestión de la Demanda</h1><div class="sub">Seguros Bolívar · Vicepresidencia de Tecnología</div><div class="date">${TODAY_STR}</div><div class="vb">V3 — Semáforo: % Completitud + Duedate</div></header><div class="container">`;
// KPIs
html+=`<h2 class="st">Indicadores Clave</h2><div class="kpi-grid"><div class="kpi-card"><div class="v">12</div><div class="l">Total Proyectos</div></div><div class="kpi-card s"><div class="v">${iniAdelantado}</div><div class="l">Iniciativas OK</div></div><div class="kpi-card d"><div class="v">${iniCritico}</div><div class="l">Iniciativas Retraso Crítico</div></div><div class="kpi-card w"><div class="v">${iniRiesgo}</div><div class="l">Iniciativas En Riesgo</div></div><div class="kpi-card s"><div class="v">${totH}</div><div class="l">Épicas Completadas</div></div><div class="kpi-card"><div class="v">${totP}</div><div class="l">Épicas En Progreso</div></div></div>`;
// Consolidated table — usa % Completitud (Hecho+Cancel/Total)
html+=`<h2 class="st" id="tc">Tabla Consolidada</h2><div class="tw"><table><thead><tr><th>Proyecto</th><th>Nombre</th><th>Iniciativa</th><th>Duedate Ini.</th><th>% Completitud</th><th>Épicas</th><th>Semáforo</th></tr></thead><tbody>`;
INI.forEach((ini,i)=>{
  const[id,code,name,ikey,idue]=ini;
  const p=P.find(x=>x.id===id);
  // Calcular % completitud real: (Hecho+Cancel)/Total
  let done=0,total=0;
  if(p){p.e.forEach(e=>{total++;if(e[2]==='hecho'||e[2]==='cancel')done++;});}
  const pct=total>0?((done/total)*100):0;
  const sm=iniSem(pct,idue);
  const dueStr=idue&&new Date(idue)<TODAY?`<span class="due-vencida">${idue} ⚠️</span>`:idue||'—';
  html+=`<tr><td><a href="#${id}">${code}</a></td><td>${name}</td><td><a href="${JIRA}/${ikey}" target="_blank">${ikey}</a></td><td>${dueStr}</td><td><div class="progress-bar"><div class="progress-fill ${pct<30?'low':pct<=60?'mid':'high'}" style="width:${pct}%"></div></div>${pct.toFixed(0)}% (${done}/${total})</td><td>${total}</td><td><span class="sem sem-${sm}"></span></td></tr>`;
});
html+=`</tbody></table></div>`;
// Detail sections (sin sección de alertas — la info está en el detalle)
// Detail sections
html+=`<h2 class="st">Detalle por Proyecto</h2><div class="nav-top">${P.map(p=>`<a href="#${p.id}">${p.c}</a>`).join('')}</div>`;
P.forEach(p=>{
  const ini=INI.find(x=>x[0]===p.id);
  // Calcular % completitud
  let doneD=0,totalD=0;
  p.e.forEach(e=>{totalD++;if(e[2]==='hecho'||e[2]==='cancel')doneD++;});
  const pctD=totalD>0?((doneD/totalD)*100).toFixed(0):0;
  html+=`<div class="ds" id="${p.id}"><div class="dh" onclick="toggleDetail(this)"><h3>${p.c} — ${p.n} (${p.e.length} épicas) · <span style="font-size:.85rem;color:var(--gray-600)">Completitud: ${pctD}% (${doneD}/${totalD})</span></h3><span class="tg">▼</span></div><div class="dc"><div class="tw"><table><thead><tr><th>Key</th><th>Resumen</th><th>Estado</th><th>Semáforo</th><th>Due Date</th></tr></thead><tbody>`;
  p.e.forEach(e=>{const[k,s,st,due,finReal]=e;const sm=sem(st,due);
    let dueCell=dueH(due,st);
    // Si Hecho y tiene finReal > duedate → mostrar "Completada con atraso"
    if((st==='hecho'||st==='cancel')&&finReal&&due&&new Date(finReal)>new Date(due)){
      const days=Math.round((new Date(finReal)-new Date(due))/864e5);
      dueCell=`<span class="due-vencida">✓ +${days}d atraso (Fin: ${finReal})</span>`;
    }
    html+=`<tr><td><a href="${JIRA}/${k}" target="_blank">${k}</a></td><td>${s}</td><td>${badge(st)}</td><td><span class="sem sem-${sm}"></span></td><td>${dueCell}</td></tr>`;
  });
  html+=`</tbody></table></div><a href="#tc" style="font-size:.85rem">↑ Volver</a></div></div>`;
});
// ═══════════════════════════════════════════════════════════════════
// SECCIÓN 1: Alertas de Vencimiento Inminente (siempre visible)
// ═══════════════════════════════════════════════════════════════════
const alertas=[];
P.forEach(p=>{p.e.forEach(e=>{
  const[k,s,st,due]=e;
  if(!due)return;
  if(st==='hecho'||st==='cancel')return;
  const diff=Math.round((new Date(due)-TODAY)/864e5);
  if(diff<=30) alertas.push({proj:p.c,name:p.n,key:k,epic:s,st,due,diff});
});});
alertas.sort((a,b)=>a.diff-b.diff);
html+=`<h2 class="st" id="alertas">🚨 Alertas — Épicas que vencen en los próximos 30 días</h2>`;
if(alertas.length===0){
  html+=`<p style="color:var(--success);font-weight:600;margin-bottom:2rem">✓ No hay épicas con vencimiento inminente.</p>`;
}else{
  html+=`<button onclick="copyTable('tbl-alertas')" style="margin-bottom:1rem;padding:.5rem 1rem;background:var(--primary);color:var(--white);border:none;border-radius:var(--radius);cursor:pointer;font-size:.85rem">📋 Copiar para Sheets</button><span id="copy-alertas-msg" style="margin-left:.5rem;font-size:.8rem;color:var(--success);display:none">✓ Copiado</span>`;
  html+=`<div class="tw"><table id="tbl-alertas"><thead><tr><th>Proyecto</th><th>Nombre</th><th>Key</th><th>Épica</th><th>Estado</th><th>Duedate</th><th>Días restantes</th></tr></thead><tbody>`;
  alertas.forEach(a=>{
    let diasCell,rowStyle='';
    if(a.diff<0){diasCell=`<span style="color:var(--danger);font-weight:700">⚠️ VENCIDA ${a.diff}d</span>`;rowStyle=' style="background:var(--danger-bg)"';}
    else if(a.diff<=7){diasCell=`<span style="color:var(--warning);font-weight:700">${a.diff}d</span>`;rowStyle=' style="background:var(--warning-bg)"';}
    else{diasCell=`${a.diff}d`;}
    html+=`<tr${rowStyle}><td>${a.proj}</td><td style="font-size:.8rem">${a.name}</td><td><a href="${JIRA}/${a.key}" target="_blank">${a.key}</a></td><td>${a.epic}</td><td>${badge(a.st)}</td><td>${a.due}</td><td>${diasCell}</td></tr>`;
  });
  html+=`</tbody></table></div>`;
}

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN 2: Índice de Bloqueos (colapsable)
// ═══════════════════════════════════════════════════════════════════
const bloqueosData=BLOCKED.map(b=>{
  const[key,resumen,proj,desde]=b;
  const dias=Math.round((TODAY-new Date(desde))/864e5);
  return {key,resumen,proj,desde,dias};
}).sort((a,b)=>b.dias-a.dias);
html+=`<div class="ds" id="bloqueos"><div class="dh" onclick="toggleDetail(this)"><h3 style="color:var(--danger)">🔴 Issues Bloqueados (${bloqueosData.length} issues)</h3><span class="tg">▼</span></div><div class="dc">`;
html+=`<button onclick="copyTable('tbl-bloqueos')" style="margin-bottom:1rem;padding:.5rem 1rem;background:var(--primary);color:var(--white);border:none;border-radius:var(--radius);cursor:pointer;font-size:.85rem">📋 Copiar para Sheets</button><span id="copy-bloqueos-msg" style="margin-left:.5rem;font-size:.8rem;color:var(--success);display:none">✓ Copiado</span>`;
html+=`<div class="tw"><table id="tbl-bloqueos"><thead><tr><th>Key</th><th>Resumen</th><th>Proyecto</th><th>Nombre</th><th>Bloqueado desde</th><th>Días bloqueado</th></tr></thead><tbody>`;
bloqueosData.forEach(b=>{
  const pData=P.find(x=>x.c===b.proj); const pName=pData?pData.n:'';
  html+=`<tr><td><a href="${JIRA}/${b.key}" target="_blank">${b.key}</a></td><td>${b.resumen}</td><td>${b.proj}</td><td style="font-size:.8rem">${pName}</td><td>${b.desde}</td><td><span style="color:var(--danger);font-weight:600">${b.dias}d</span></td></tr>`;
});
html+=`</tbody></table></div></div></div>`;

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN 3: Aging — Épicas zombi (>60 días vencidas en progreso)
// ═══════════════════════════════════════════════════════════════════
const zombis=[];
P.forEach(p=>{p.e.forEach(e=>{
  const[k,s,st,due]=e;
  if(st!=='prog'||!due)return;
  const diff=Math.round((TODAY-new Date(due))/864e5);
  const pName=p.n;
  if(diff>60) zombis.push({proj:p.c,pName,key:k,epic:s,due,dias:diff});
});});
zombis.sort((a,b)=>b.dias-a.dias);
html+=`<div class="ds" id="aging"><div class="dh" onclick="toggleDetail(this)"><h3 style="color:var(--warning)">⏳ Épicas en Progreso > 60 días sin completar (${zombis.length})</h3><span class="tg">▼</span></div><div class="dc">`;
if(zombis.length===0){
  html+=`<p style="color:var(--success);margin-bottom:1rem">✓ No hay épicas zombi.</p>`;
}else{
  html+=`<button onclick="copyTable('tbl-aging')" style="margin-bottom:1rem;padding:.5rem 1rem;background:var(--primary);color:var(--white);border:none;border-radius:var(--radius);cursor:pointer;font-size:.85rem">📋 Copiar para Sheets</button><span id="copy-aging-msg" style="margin-left:.5rem;font-size:.8rem;color:var(--success);display:none">✓ Copiado</span>`;
  html+=`<div class="tw"><table id="tbl-aging"><thead><tr><th>Proyecto</th><th>Nombre</th><th>Key</th><th>Épica</th><th>Duedate</th><th>Días vencida</th></tr></thead><tbody>`;
  zombis.forEach(z=>{
    html+=`<tr><td>${z.proj}</td><td style="font-size:.8rem">${z.pName}</td><td><a href="${JIRA}/${z.key}" target="_blank">${z.key}</a></td><td>${z.epic}</td><td>${z.due}</td><td><span style="color:var(--danger);font-weight:600">${z.dias}d</span></td></tr>`;
  });
  html+=`</tbody></table></div>`;
}
html+=`</div></div>`;

// ═══════════════════════════════════════════════════════════════════
// SECCIÓN 4: Mapa de Dependencias Inter-Proyecto
// ═══════════════════════════════════════════════════════════════════
// Mapa de key → nombre corto para visualización en SVG y tablas
const KEY_TO_NAME={
  'GD-902':'Suscripción','GD-903':'Autogestión Pólizas','GD-905':'Carpeta Única',
  'GD-907':'Unif. Plataformas','GD-929':'Bienestar ARL','GD-971':'Ciber WAPP',
  'GD-976':'Ciber SSE','GD-981':'Cumplimiento 0-500M','GD-1130':'Cuentas Médicas',
  'GD-1136':'Migración Bizagi','GD-1141':'APM','GD-904':'Indemnizaciones',
  'Tronador':'Tronador','Saghi (ext)':'Saghi (ext)'
};
/** Resuelve key a nombre corto para visualización. */
function depName(key){return KEY_TO_NAME[key]||key;}

const DEPS=[
['GD-902','GD-905','Carpeta Única para gestión documental'],
['GD-902','GD-907','Portal Intermediarios como canal de solicitudes'],
['GD-907','GD-905','Integración Carpeta Única y Gestor Documental'],
['GD-907','Saghi (ext)','Backend externo — Bloqueado'],
['GD-981','GD-907','Tribu Portal de Intermediarios'],
['GD-981','Tronador','Core seguros para emisión'],
['GD-929','GD-1136','Bizagi BPMS para back-office'],
['GD-929','GD-905','O\'Leary para soportes médicos'],
['GD-1130','GD-1136','Bizagi BPMS para flujos de pago'],
['GD-1130','Tronador','Liquidación de pólizas'],
['GD-1136','Tronador','Pólizas y reservas (proceso 70)']
];
// Posiciones de nodos para el SVG (manualmente distribuidas)
const nodePositions={
  'GD-905':{x:450,y:250},'GD-907':{x:200,y:100},'GD-902':{x:700,y:100},
  'GD-929':{x:200,y:400},'GD-1136':{x:450,y:400},'GD-1130':{x:700,y:400},
  'GD-981':{x:80,y:250},'Tronador':{x:450,y:480},'Saghi (ext)':{x:450,y:50}
};
// Colores por estado
const nodeColors={
  'GD-902':'#2e7d32','GD-905':'#2e7d32','GD-904':'#2e7d32',
  'GD-929':'#f57f17','GD-981':'#f57f17','GD-971':'#f57f17','GD-976':'#f57f17','GD-1130':'#f57f17',
  'GD-907':'#c62828','GD-1136':'#c62828','GD-1141':'#c62828',
  'Tronador':'#78909c','Saghi (ext)':'#78909c'
};
// Generar SVG inline
let svgContent=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 530" style="width:100%;max-width:900px;height:auto;display:block;margin:0 auto 1.5rem">`;
svgContent+=`<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#546e7a"/></marker></defs>`;
// Dibujar líneas de dependencia
DEPS.forEach(dep=>{
  const from=nodePositions[dep[0]];const to=nodePositions[dep[1]];
  if(from&&to){
    const dx=to.x-from.x,dy=to.y-from.y;
    const dist=Math.sqrt(dx*dx+dy*dy);
    const offsetFrom=42,offsetTo=42;
    const x1=from.x+(dx/dist)*offsetFrom,y1=from.y+(dy/dist)*offsetFrom;
    const x2=to.x-(dx/dist)*offsetTo,y2=to.y-(dy/dist)*offsetTo;
    svgContent+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#90a4ae" stroke-width="1.5" marker-end="url(#arrowhead)"/>`;
  }
});
// Dibujar nodos con nombres de proyecto (no keys)
Object.entries(nodePositions).forEach(([key,pos])=>{
  const color=nodeColors[key]||'#78909c';
  const name=depName(key);
  const isExt=key==='Tronador'||key==='Saghi (ext)';
  const fontSize=name.length>14?'8':name.length>10?'9':isExt?'10':'10';
  svgContent+=`<circle cx="${pos.x}" cy="${pos.y}" r="40" fill="${color}" opacity="0.9" stroke="#fff" stroke-width="2"/>`;
  svgContent+=`<text x="${pos.x}" y="${pos.y+4}" text-anchor="middle" font-size="${fontSize}" font-weight="600" fill="#fff" font-family="system-ui,sans-serif">${name}</text>`;
});
// Leyenda (esquina superior derecha, sin tapar nodos)
svgContent+=`<rect x="710" y="10" width="180" height="100" rx="6" fill="#fff" stroke="#e0e0e0"/>`;
svgContent+=`<text x="720" y="28" font-size="10" font-weight="700" fill="#333" font-family="system-ui,sans-serif">Leyenda</text>`;
svgContent+=`<circle cx="728" cy="42" r="6" fill="#2e7d32"/><text x="740" y="46" font-size="9" fill="#333" font-family="system-ui,sans-serif">Buena completitud</text>`;
svgContent+=`<circle cx="728" cy="60" r="6" fill="#f57f17"/><text x="740" y="64" font-size="9" fill="#333" font-family="system-ui,sans-serif">En riesgo</text>`;
svgContent+=`<circle cx="728" cy="78" r="6" fill="#c62828"/><text x="740" y="82" font-size="9" fill="#333" font-family="system-ui,sans-serif">Requiere normalización</text>`;
svgContent+=`<circle cx="728" cy="96" r="6" fill="#78909c"/><text x="740" y="100" font-size="9" fill="#333" font-family="system-ui,sans-serif">Core</text>`;
svgContent+=`</svg>`;

// Evaluar riesgo por dependencia
function depRisk(from,to){
  const redProjects=['GD-907','GD-1136','GD-1141'];
  const extSystems=['Tronador','Saghi (ext)'];
  if(extSystems.includes(to))return '<span style="color:var(--danger);font-weight:600">Alto — Externo</span>';
  if(redProjects.includes(to)||redProjects.includes(from))return '<span style="color:var(--danger);font-weight:600">Alto</span>';
  return '<span style="color:var(--warning)">Medio</span>';
}

html+=`<div class="ds" style="margin-top:3rem" id="dependencias"><div class="dh" onclick="toggleDetail(this)"><h3 style="color:var(--primary)">🔗 Mapa de Dependencias Inter-Proyecto (${DEPS.length} relaciones documentadas)</h3><span class="tg">▼</span></div><div class="dc">`;
html+=`<p style="font-size:.85rem;color:var(--gray-600);margin-bottom:1rem;font-style:italic">Fuente: Informes Maestros de cada proyecto (GitHub Pages). No existen issue links en Jira — dependencias identificadas por análisis documental.</p>`;
html+=svgContent;
html+=`<button onclick="copyTable('tbl-deps')" style="margin-bottom:1rem;padding:.5rem 1rem;background:var(--primary);color:var(--white);border:none;border-radius:var(--radius);cursor:pointer;font-size:.85rem">📋 Copiar para Sheets</button><span id="copy-deps-msg" style="margin-left:.5rem;font-size:.8rem;color:var(--success);display:none">✓ Copiado</span>`;
html+=`<div class="tw"><table id="tbl-deps"><thead><tr><th>Proyecto</th><th>Depende de</th><th>Tipo de dependencia</th><th>Riesgo</th></tr></thead><tbody>`;
DEPS.forEach(d=>{
  html+=`<tr><td>${depName(d[0])}</td><td>${depName(d[1])}</td><td>${d[2]}</td><td>${depRisk(d[0],d[1])}</td></tr>`;
});
html+=`</tbody></table></div></div></div>`;

// Inconsistencias tab - Épicas finalizadas sin Fecha Fin Real
const inconsData=[
['GD-902','PRY Transformación de Suscripción','GD902-536','Mejoras Filenet','Hecho','2026-12-29'],
['GD-902','PRY Transformación de Suscripción','GD902-839','MR Dashboard activación rol','Hecho','2026-05-31'],
['GD-902','PRY Transformación de Suscripción','GD902-844','MR Config Reglas Lenguaje Natural','Hecho','2026-05-31'],
['GD-902','PRY Transformación de Suscripción','GD902-910','MR Vigencia reglas','Hecho','2026-05-31'],
['GD-902','PRY Transformación de Suscripción','GD902-923','MR Aseguramiento Calidad','Hecho','2026-05-31'],
['GD-902','PRY Transformación de Suscripción','GD902-932','MR Ejecución Simulación','Hecho','2026-05-31'],
['GD-902','PRY Transformación de Suscripción','GD902-937','MR Tablero Gestión Reglas','Hecho','2026-05-31'],
['GD-902','PRY Transformación de Suscripción','GD902-940','MR Consulta Trazabilidad','Hecho','2026-06-30'],
['GD-902','PRY Transformación de Suscripción','GD902-947','MR Edición activar inactivar','Hecho','2026-05-31'],
['GD-902','PRY Transformación de Suscripción','GD902-982','MR Registro Evidencia','Hecho','2026-06-30'],
['GD-902','PRY Transformación de Suscripción','GD902-995','MR Exportación reportes','Hecho','2026-06-30'],
['GD-905','PRY Carpeta Única de Cliente','GD905-49','API componente integraciones','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-98','Config inicial proyecto','Hecho','2026-12-31'],
['GD-905','PRY Carpeta Única de Cliente','GD905-103','Pantalla Gestión Config','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-108','Visualización tablas','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-113','Creación documentos','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-114','Editar información','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-119','Cargar masivamente','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-120','Creación datos','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-121','Validación y edición','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-122','Admin Módulo Procesos','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-127','Creación subprocesos','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-132','Editar subprocesos','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-137','Admin edición proceso','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-142','Trazabilidad y Auditoría','Hecho','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-259','Visualización docs operación','Cancelado','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-262','Gestión vigencias','Cancelado','2026-06-01'],
['GD-905','PRY Carpeta Única de Cliente','GD905-264','Creación caso workflow','Cancelado','2026-06-01'],
['GD-971','Ciber 5.0 WAPP Multinube','GD971-43','Kickoff proveedor','Hecho','2026-01-19'],
['GD-971','Ciber 5.0 WAPP Multinube','GD971-44','Requisitos','Hecho','2026-01-30'],
['GD-981','Plataforma Cumplimiento 0-500M','GD981-733','Aplicación sobrecomisión','Hecho','2026-06-10'],
['GD-1136','Migración Bizagi / BPMS','GD1136-2','Bizagi Setup cloud','Hecho','2026-03-31'],
['GD-1141','PRY APM','GD1141-4','Plan Migración Bajos','Hecho','2026-05-25'],
['GD-1141','PRY APM','GD1141-11','Migración Producción','Hecho','2026-06-30']
];
html+=`<div class="ds" style="margin-top:3rem" id="inconsistencias"><div class="dh" onclick="toggleDetail(this)"><h3 style="color:var(--danger)">⚠️ Inconsistencias — Épicas finalizadas sin Fecha Fin Real (${inconsData.length})</h3><span class="tg">▼</span></div><div class="dc">`;
html+=`<p style="font-size:.9rem;color:var(--gray-600);margin-bottom:1rem">El campo "Fecha Fin Real" (customfield_25346) no está registrado en estas ${inconsData.length} épicas. Esto impide validar si el entregable se completó dentro del plazo comprometido.</p>`;
html+=`<button onclick="copyTable('tbl-incons')" style="margin-bottom:1rem;padding:.5rem 1rem;background:var(--primary);color:var(--white);border:none;border-radius:var(--radius);cursor:pointer;font-size:.85rem">📋 Copiar tabla para Sheets</button><span id="copy-msg" style="margin-left:.5rem;font-size:.8rem;color:var(--success);display:none">✓ Copiado</span>`;
html+=`<div class="tw"><table id="tbl-incons"><thead><tr><th>Proyecto</th><th>Iniciativa</th><th>Key</th><th>Épica</th><th>Estado</th><th>Duedate</th></tr></thead><tbody>`;
inconsData.forEach(r=>{html+=`<tr><td>${r[0]}</td><td>${r[1]}</td><td><a href="${JIRA}/${r[2]}" target="_blank">${r[2]}</a></td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`;});
html+=`</tbody></table></div></div></div>`;
// Footer
html+=`</div><footer class="footer"><p>Dashboard Portafolio V3 — Gestión de la Demanda · Seguros Bolívar</p><p>Generado: ${TODAY_STR} · Reglas: 🟢 Completitud≥60% · 🟡 Completitud 30-60% o duedate vencida (En Progreso) · 🔴 Completitud&lt;30% o duedate INI vencida · ⚪ Sin iniciar · ✓ Completada (Hecho)</p></footer>
<script>function toggleDetail(el){var c=el.nextElementSibling,t=el.querySelector('.tg');if(c.classList.contains('open')){c.classList.remove('open');t.textContent='▼';}else{c.classList.add('open');t.textContent='▲';}}
function copyTable(tableId){var t=document.getElementById(tableId);var rows=t.querySelectorAll('tr');var tsv=[];rows.forEach(function(r){var cells=r.querySelectorAll('th,td');var row=[];cells.forEach(function(c){row.push(c.textContent.trim());});tsv.push(row.join('\\t'));});navigator.clipboard.writeText(tsv.join('\\n')).then(function(){var msgId=tableId==='tbl-incons'?'copy-msg':'copy-'+tableId.replace('tbl-','')+'-msg';var m=document.getElementById(msgId);if(m){m.style.display='inline';setTimeout(function(){m.style.display='none';},2000);}});}</script></body></html>`;
// Write file
const out=path.join(__dirname,'..','docs','portafolio-proyectos.html');
fs.writeFileSync(out,html,'utf8');
console.log('✅ HTML V3 generado:',out);
console.log(`   ${P.length} proyectos, ${totH+totP+totPH} épicas`);
