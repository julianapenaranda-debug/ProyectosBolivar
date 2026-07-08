#!/usr/bin/env node
/** Genera docs/portafolio-proyectos.html V3. Run: node scripts/generate-portfolio-v3.js */
const fs=require('fs'),path=require('path');
const JIRA='https://jirasegurosbolivar.atlassian.net/browse';
const TODAY=new Date();
const TODAY_STR=TODAY.toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});
// Datos de Iniciativa 2026 (fuente oficial del semáforo consolidado)
// [id, code, name, ini_key, ini_duedate, ini_spi, ini_estado]
const INI=[
['gd902','GD-902','PRY Transformación de Suscripción (Motor suscripción)','GD902-533','2026-12-30',2.80,'Adelantado',31.2,87.4],
['gd903','GD-903','PRY Autogestión Pólizas Individuales (Simon ventas)','GD903-246','2026-12-31',0.41,'Retraso Crítico',15.4,6.3],
['gd905','GD-905','PRY Carpeta Única de Cliente','GD905-38','2026-09-30',2.41,'Adelantado',35.9,86.5],
['gd907','GD-907','Unificación de Plataformas','GD907-613','2026-12-31',4.64,'Adelantado',14.4,66.9],
['gd929','GD-929','PRY Gestión en Bienestar - Autorizaciones ARL/Salud','GD929-716','2026-12-31',2.99,'Adelantado',15.4,46.0],
['gd971','GD-971','Ciber 5.0 WAPP Multinube','GD971-42','2026-03-31',0.70,'Retraso Alto',71.1,50.0],
['gd976','GD-976','Ciber 5.0 SSE (Security Service Edge)','GD976-48','2026-07-23',0,'Sin iniciar',6.5,0],
['gd981','GD-981','Plataforma Cumplimiento Autogestión 0-500M','GD981-1037','2026-12-31',2.27,'Adelantado',22.6,51.3],
['gd1130','GD-1130','PRY Cuentas Médicas','GD1130-75','2026-11-09',0.56,'Retraso Crítico',46.8,26.2],
['gd1136','GD-1136','Migración e Implementación Bizagi / BPMS','GD1136-18','2026-12-31',2.42,'Adelantado',15.4,37.2],
['gd1141','GD-1141','PRY Access Policy Management (APM)','GD1141-3','2026-08-31',2.74,'Adelantado',24.3,66.7],
['gd904','GD-904','PRY Transformación de Indemnizaciones','GD904-509','2026-12-31',3.35,'Adelantado',15.4,51.5]
];
function iniSem(spi,due,epics){
  // Duedate de iniciativa vencida
  if(due&&new Date(due)<TODAY)return 'rojo';
  // SPI de la Iniciativa (fuente oficial Jira) — sin sobreescribir por épicas
  if(spi>=1)return 'verde';
  if(spi>=0.8)return 'amarillo';
  if(spi>0)return 'rojo';
  return 'gris';
}
const P=[
{id:'gd902',c:'GD-902',n:'PRY Transformación de Suscripción (Motor suscripción)',e:[
['GD902-534','Extracción reglas tronador','prog',1.76,'2026-06-30',47.93,84.4],
['GD902-535','Creación APIS motor','prog',2.73,'2026-12-29',32.04,87.4],
['GD902-536','Mejoras Filenet','hecho',3.12,'2026-12-29',32.04,100,'2026-01-30'],
['GD902-825','MR Desarrollo bases técnicas','prog',1.28,'2026-06-30',64.2,82.3],
['GD902-834','MR Gestión Accesos Seguridad','prog',1.63,'2026-07-31',56.03,91.1],
['GD902-839','MR Dashboard activación rol','hecho',1.66,'2026-05-31',60.24,100,'2026-06-05'],
['GD902-844','MR Config Reglas Lenguaje Natural','hecho',2.18,'2026-05-31',45.9,100,'2026-05-29'],
['GD902-910','MR Vigencia reglas','hecho',2.18,'2026-05-31',45.9,100,'2026-05-29'],
['GD902-923','MR Aseguramiento Calidad','hecho',2.18,'2026-05-31',45.9,100,'2026-05-29'],
['GD902-932','MR Ejecución Simulación','hecho',0,'2026-05-31',0,100,'2026-05-29'],
['GD902-937','MR Tablero Gestión Reglas','hecho',0,'2026-05-31',0,100,'2026-05-29'],
['GD902-940','MR Consulta Trazabilidad','hecho',0,'2026-06-30',0,100,'2026-06-24'],
['GD902-947','MR Edición activar inactivar','hecho',2.18,'2026-05-31',45.9,100,'2026-05-29'],
['GD902-960','Registro Evidencia','prog',0,'2026-06-30',0,68.8],
['GD902-969','MR Modulo reportería','prog',0,'2026-06-30',0,98],
['GD902-982','MR Registro Evidencia','hecho',0,'2026-06-30',0,100,'2026-06-24'],
['GD902-995','MR Exportación reportes','hecho',0,'2026-06-30',0,100,'2026-06-24'],
['GD902-1004','MR Restaurar regla','prog',0,'2026-06-30',0,98],
['GD902-1009','MR Config Alertas','prog',0,'2026-06-30',0,0],
['GD902-1018','MR envío notificaciones','prog',0,'2026-06-30',0,22.5],
['GD902-1310','Ajustes Evolutivos','porhacer',0,null,0,47.5]]},
{id:'gd903',c:'GD-903',n:'PRY Autogestión Pólizas Individuales (Simon ventas)',e:[
['GD903-42','Autos Cotización y Emisión','prog',1.42,'2026-07-31',45.08,64.2],
['GD903-310','Vida Cotización y Emisión','porhacer',0,null,0,0],
['GD903-321','Autos Migración Angular 17+','porhacer',0,null,0,0],
['GD903-402','Autos Modificaciones Autogestión','porhacer',0,null,0,0.5],
['GD903-403','Vida Modificaciones','porhacer',0,null,0,0],
['GD903-404','Salud Modificaciones','porhacer',0,null,0,0],
['GD903-405','Hogar Modificaciones','porhacer',0,null,0,0],
['GD903-406','Módulo Consulta Cotizaciones','porhacer',0,null,0,0],
['GD903-407','Salud Cotización y Emisión','porhacer',0,null,0,0],
['GD903-408','Unificación Firma Electrónica','porhacer',0,null,0,0],
['GD903-409','Hogar Cotización y Emisión','porhacer',0,null,0,0]]},
{id:'gd905',c:'GD-905',n:'PRY Carpeta Única de Cliente',e:[
['GD905-39','Módulo parametrización docs','prog',1.28,'2026-06-30',73.85,94.2],
['GD905-44','Integración gestor documental','prog',0.66,'2026-05-31',100,67.3],
['GD905-49','API componente integraciones','hecho',0.50,'2026-06-01',0,100,'2026-05-14'],
['GD905-98','Config inicial proyecto','hecho',3.51,'2026-12-31',28.53,100,'2026-02-27'],
['GD905-103','Pantalla Gestión Config','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-108','Visualización tablas','hecho',1.34,'2026-06-01',74.63,100,'2026-05-11'],
['GD905-113','Creación documentos','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-114','Editar información','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-119','Cargar masivamente','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-120','Creación datos','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-121','Validación y edición','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-122','Admin Módulo Procesos','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-127','Creación subprocesos','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-132','Editar subprocesos','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-137','Admin edición proceso','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-142','Trazabilidad y Auditoría','hecho',1.34,'2026-06-01',74.63,100,'2026-06-11'],
['GD905-259','Visualización docs operación','cancel',1.26,'2026-06-01',79.1,100,'2026-04-27'],
['GD905-261','Creación OCR y API','prog',0.50,'2026-10-31',33.18,16.7],
['GD905-262','Gestión vigencias','cancel',0,'2026-06-01',45.16,0,'2026-05-22'],
['GD905-264','Creación caso workflow','cancel',1.44,'2026-06-01',69.57,100,'2026-04-27'],
['GD905-390','Evolutivos CUC Oleary','porhacer',0,'2026-10-31',0,34.1]]},
{id:'gd907',c:'GD-907',n:'Unificación de Plataformas',e:[
['GD907-26','Autoservicio empleados','prog',2.93,'2026-12-31',32.46,95],
['GD907-27','Autogestión datos','prog',2.95,'2026-12-31',32.46,95.7],
['GD907-620','Ajustes vulnerabilidades IDOR','porhacer',0,null,0,25],
['GD907-631','Ajustes Portal Migración','hecho',0,null,0,100,'2026-03-31'],
['GD907-651','Implementación Tags','prog',0,null,0,96.5],
['GD907-658','Modal Informativo Admin','prog',0,null,0,95],
['GD907-664','Migración módulo GH','porhacer',0,null,0,23.3],
['GD907-901','Desarrollos backend Sagui','porhacer',0,null,0,0]]},
{id:'gd929',c:'GD-929',n:'PRY Gestión en Bienestar - Autorizaciones ARL/Salud',e:[
['GD929-729','Despliegue prioridad 1','prog',1.84,'2026-12-31',15.38,51.6],
['GD929-1395','Despliegue prioridad 2','prog',0,'2026-07-09',0,78.5],
['GD929-1396','Despliegue prioridad 3','prog',0,'2026-08-14',0,10.9],
['GD929-1688','Automatización pruebas','porhacer',0,null,0,0]]},
{id:'gd971',c:'GD-971',n:'Ciber 5.0 WAPP Multinube',e:[
['GD971-43','Kickoff proveedor','hecho',1.00,'2026-01-19',100,100],
['GD971-44','Requisitos','hecho',1.00,'2026-01-30',100,100],
['GD971-45','Implementación Cloudflare 27 dominios','prog',0.50,'2026-03-27',100,50],
['GD971-46','Marcha Blanca','prog',0,'2026-07-09',33.77,0],
['GD971-47','Cierre del proyecto','prog',0,'2026-07-09',1.96,0]]},
{id:'gd976',c:'GD-976',n:'Ciber 5.0 SSE (Security Service Edge)',e:[
['GD976-49','Marcha blanca proyecto','prog',0,'2026-07-23',6.52,0]]},
{id:'gd981',c:'GD-981',n:'Plataforma Cumplimiento Autogestión 0-500M',e:[
['GD981-733','Aplicación automática sobrecomisión','hecho',1.00,'2026-06-10',100,100],
['GD981-1412','Atención solicitudes email','prog',1.16,'2026-07-09',27.45,31.8],
['GD981-1506','Retoma solicitudes','porhacer',2.57,'2026-07-22',9.09,23.3],
['GD981-1507','Modificación tasa','prog',0.81,'2026-07-10',61.36,50]]},
{id:'gd1130',c:'GD-1130',n:'PRY Cuentas Médicas',e:[
['GD1130-19','Front radicación facturas','prog',1.07,'2026-11-09',46.75,50],
['GD1130-81','Front Gestor Cuentas Médicas','prog',0,'2026-11-09',46.75,0],
['GD1130-82','Flujo Cuentas Médicas IPS','prog',1.05,'2026-11-09',46.75,46.9],
['GD1130-83','Paramétricas Cuentas Médicas','prog',0.26,'2026-11-09',46.75,12],
['GD1130-281','SIIFA Cuentas Médicas - Fase 1','prog',0,null,0,20]]},
{id:'gd1136',c:'GD-1136',n:'Migración e Implementación Bizagi / BPMS',e:[
['GD1136-2','Bizagi Setup cloud','hecho',1.34,'2026-03-31',74.62,100],
['GD1136-34','Paquete 1 Radicación','prog',0.49,'2026-05-08',100,48.6],
['GD1136-35','Paquete 2 Análisis','prog',0,'2026-05-25',100,0],
['GD1136-36','Paquete 3 Cierre','prog',0,'2026-06-19',100,0]]},
{id:'gd1141',c:'GD-1141',n:'PRY Access Policy Management (APM)',e:[
['GD1141-4','Plan Migración Bajos','hecho',1.00,'2026-05-25',100,100],
['GD1141-11','Migración Producción','hecho',0,'2026-06-30',0,100],
['GD1141-28','Migración APM DRP','prog',0,'2026-07-31',3.23,0]]},
{id:'gd904',c:'GD-904',n:'PRY Transformación de Indemnizaciones',e:[
['GD904-379','MVP Inicial | Habilitar Vida-Renta','hecho',1.00,'2026-02-28',98.89,100,'2026-03-11'],
['GD904-518','Evolutivo | Retomar indemnización multicanal','porhacer',0,null,0,0],
['GD904-633','Evolutivo | Activar botón trazabilidad','porhacer',0,null,0,23.1],
['GD904-663','Plan contingencia | Automatizar correos','prog',0.50,'2026-05-15',100,50],
['GD904-683','MVP Inicial | Proceso Pac conversacional','hecho',0,'2025-12-11',0,95,'2025-12-02'],
['GD904-720','Plan contingencia | Flujo Trabajo Rentas','prog',0.90,'2026-05-28',100,90],
['GD904-778','Flujo de trabajo Patrimoniales','porhacer',0,null,0,0]]}
];

function isOverdue(d){if(!d)return false;return new Date(d)<TODAY;}
function sem(st,spi,due){
  if(st==='hecho'||st==='cancel')return spi>=1?'verde':'gris';
  if(st==='porhacer')return 'gris';
  if(isOverdue(due))return 'amarillo';
  if(spi>=1)return 'verde';if(spi>=0.8)return 'amarillo';
  if(spi>0)return 'rojo';return 'gris';
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
INI.forEach(ini=>{const spi=ini[5];const due=ini[4];
  if(due&&new Date(due)<TODAY){iniCritico++;}
  else if(spi>=1){iniAdelantado++;}
  else if(spi>=0.8){iniRiesgo++;}
  else if(spi>0){iniCritico++;}
  else{iniSinIniciar++;}
});
let html=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Dashboard Portafolio V3 — GD | Seguros Bolívar</title>
<style>:root{--primary:#1a237e;--primary-light:#283593;--primary-dark:#0d1642;--white:#fff;--gray-50:#f8f9fa;--gray-100:#f1f3f5;--gray-200:#e9ecef;--gray-400:#ced4da;--gray-500:#adb5bd;--gray-600:#868e96;--gray-800:#343a40;--success:#2e7d32;--success-bg:#e8f5e9;--warning:#f57f17;--warning-bg:#fff8e1;--danger:#c62828;--danger-bg:#ffebee;--neutral:#546e7a;--neutral-bg:#eceff1;--font:system-ui,-apple-system,sans-serif;--radius:8px;--shadow:0 2px 8px rgba(26,35,126,.08)}*{margin:0;padding:0;box-sizing:border-box}body{font-family:var(--font);background:var(--gray-50);color:var(--gray-800);line-height:1.5}a{color:var(--primary);text-decoration:none}a:hover{text-decoration:underline}.header{background:linear-gradient(135deg,var(--primary-dark),var(--primary));color:var(--white);padding:2rem 1.5rem;text-align:center}.header h1{font-size:1.75rem;font-weight:700;margin-bottom:.25rem}.header .sub{font-size:1rem;opacity:.85}.header .date{font-size:.85rem;opacity:.7;margin-top:.5rem}.header .vb{display:inline-block;background:rgba(255,255,255,.15);padding:.2rem .6rem;border-radius:12px;font-size:.75rem;margin-top:.5rem}.container{max-width:1400px;margin:0 auto;padding:1.5rem}.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem}.kpi-card{background:var(--white);border-radius:var(--radius);padding:1.25rem;box-shadow:var(--shadow);text-align:center;border-top:3px solid var(--primary)}.kpi-card .v{font-size:2rem;font-weight:700;color:var(--primary)}.kpi-card .l{font-size:.85rem;color:var(--gray-600);margin-top:.25rem}.kpi-card.d{border-top-color:var(--danger)}.kpi-card.d .v{color:var(--danger)}.kpi-card.s{border-top-color:var(--success)}.kpi-card.s .v{color:var(--success)}.kpi-card.w{border-top-color:var(--warning)}.kpi-card.w .v{color:var(--warning)}.st{font-size:1.25rem;font-weight:700;color:var(--primary);margin:2rem 0 1rem;padding-bottom:.5rem;border-bottom:2px solid var(--gray-200)}.tw{overflow-x:auto;background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:2rem}table{width:100%;border-collapse:collapse;font-size:.875rem}thead{background:var(--primary);color:var(--white)}th{padding:.75rem 1rem;text-align:left;font-weight:600;white-space:nowrap}td{padding:.65rem 1rem;border-bottom:1px solid var(--gray-200)}tbody tr:hover{background:var(--gray-100)}.sem{display:inline-block;width:14px;height:14px;border-radius:50%;vertical-align:middle}.sem-rojo{background:var(--danger);box-shadow:0 0 4px rgba(198,40,40,.4)}.sem-amarillo{background:var(--warning);box-shadow:0 0 4px rgba(245,127,23,.4)}.sem-verde{background:var(--success);box-shadow:0 0 4px rgba(46,125,50,.4)}.sem-gris{background:var(--gray-400)}.progress-bar{background:var(--gray-200);border-radius:10px;height:8px;width:100%;min-width:80px;overflow:hidden}.progress-fill{height:100%;border-radius:10px}.progress-fill.low{background:var(--danger)}.progress-fill.mid{background:var(--warning)}.progress-fill.high{background:var(--success)}.badge{display:inline-block;padding:.2rem .6rem;border-radius:12px;font-size:.75rem;font-weight:600;white-space:nowrap}.badge-hecho{background:var(--success-bg);color:var(--success)}.badge-progreso{background:var(--warning-bg);color:var(--warning)}.badge-porhacer{background:var(--neutral-bg);color:var(--neutral)}.badge-cancelado{background:var(--danger-bg);color:var(--danger);text-decoration:line-through}.al{background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);padding:1rem;margin-bottom:2rem}.ai{padding:.5rem .75rem;border-left:4px solid var(--danger);margin-bottom:.5rem;background:var(--danger-bg);border-radius:0 var(--radius) var(--radius) 0;font-size:.85rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem}.ai.aw{border-left-color:var(--warning);background:var(--warning-bg)}.ai .sv{font-weight:700;color:var(--danger);white-space:nowrap}.ai.aw .sv{color:var(--warning)}.ds{background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:1.5rem}.dh{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;padding:1.25rem 1.5rem;cursor:pointer;user-select:none;border-radius:var(--radius)}.dh:hover{background:var(--gray-50)}.dh h3{font-size:1.1rem;color:var(--primary-dark);flex:1}.dh .tg{font-size:1.2rem}.dc{padding:0 1.5rem 1.5rem;display:none}.dc.open{display:block}.due-vencida{color:var(--danger);font-weight:600}.nav-top{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.5rem}.nav-top a{font-size:.8rem;padding:.3rem .6rem;background:var(--gray-100);border-radius:var(--radius)}.footer{text-align:center;padding:2rem 1rem;font-size:.8rem;color:var(--gray-500);border-top:1px solid var(--gray-200);margin-top:2rem}@media(max-width:768px){.header h1{font-size:1.3rem}.kpi-grid{grid-template-columns:repeat(2,1fr)}th,td{padding:.5rem;font-size:.8rem}}</style></head><body>
<header class="header"><h1>Dashboard de Portafolio V3 — Gestión de la Demanda</h1><div class="sub">Seguros Bolívar · Vicepresidencia de Tecnología</div><div class="date">${TODAY_STR}</div><div class="vb">V3 — Semáforo: SPI + Duedate</div></header><div class="container">`;
// KPIs
html+=`<h2 class="st">Indicadores Clave</h2><div class="kpi-grid"><div class="kpi-card"><div class="v">12</div><div class="l">Total Proyectos</div></div><div class="kpi-card s"><div class="v">${iniAdelantado}</div><div class="l">Iniciativas OK</div></div><div class="kpi-card d"><div class="v">${iniCritico}</div><div class="l">Iniciativas Retraso Crítico</div></div><div class="kpi-card w"><div class="v">${iniRiesgo}</div><div class="l">Iniciativas En Riesgo</div></div><div class="kpi-card s"><div class="v">${totH}</div><div class="l">Épicas Completadas</div></div><div class="kpi-card"><div class="v">${totP}</div><div class="l">Épicas En Progreso</div></div></div>`;
// Consolidated table — usa SPI de Iniciativa (fuente Jira)
html+=`<h2 class="st" id="tc">Tabla Consolidada</h2><div class="tw"><table><thead><tr><th>Proyecto</th><th>Nombre</th><th>Iniciativa</th><th>Duedate Ini.</th><th>SPI</th><th>% Completitud</th><th>Épicas</th><th>Semáforo</th></tr></thead><tbody>`;
INI.forEach((ini,i)=>{
  const[id,code,name,ikey,idue,ispi,istate,ireal,iplan]=ini;
  const p=P.find(x=>x.id===id);
  const sm=iniSem(ispi,idue,p?p.e:null);
  const dueStr=idue&&new Date(idue)<TODAY?`<span class="due-vencida">${idue} ⚠️</span>`:idue||'—';
  // Calcular % completitud real: (Hecho+Cancel)/Total
  let done=0,total=0;
  if(p){p.e.forEach(e=>{total++;if(e[2]==='hecho'||e[2]==='cancel')done++;});}
  const pct=total>0?((done/total)*100).toFixed(0):0;
  html+=`<tr><td><a href="#${id}">${code}</a></td><td>${name}</td><td><a href="${JIRA}/${ikey}" target="_blank">${ikey}</a></td><td>${dueStr}</td><td>${ispi.toFixed(2)}</td><td><div class="progress-bar"><div class="progress-fill ${pct<30?'low':pct<=60?'mid':'high'}" style="width:${pct}%"></div></div>${pct}% (${done}/${total})</td><td>${total}</td><td><span class="sem sem-${sm}"></span></td></tr>`;
});
html+=`</tbody></table></div>`;
// Detail sections (sin sección de alertas — la info está en el detalle)
// Detail sections
html+=`<h2 class="st">Detalle por Proyecto</h2><div class="nav-top">${P.map(p=>`<a href="#${p.id}">${p.c}</a>`).join('')}</div>`;
P.forEach(p=>{
  const ini=INI.find(x=>x[0]===p.id);
  const iniReal=ini?ini[7]:0;const iniPlan=ini?ini[8]:0;
  // Calcular % completitud
  let doneD=0,totalD=0;
  p.e.forEach(e=>{totalD++;if(e[2]==='hecho'||e[2]==='cancel')doneD++;});
  const pctD=totalD>0?((doneD/totalD)*100).toFixed(0):0;
  html+=`<div class="ds" id="${p.id}"><div class="dh" onclick="toggleDetail(this)"><h3>${p.c} — ${p.n} (${p.e.length} épicas) · <span style="font-size:.85rem;color:var(--gray-600)">Completitud: ${pctD}% (${doneD}/${totalD})</span></h3><span class="tg">▼</span></div><div class="dc"><div class="tw"><table><thead><tr><th>Key</th><th>Resumen</th><th>Estado</th><th>SPI</th><th>Semáforo</th><th>Due Date</th></tr></thead><tbody>`;
  p.e.forEach(e=>{const[k,s,st,spi,due,r,pl,finReal]=e;const sm=sem(st,spi,due);
    let dueCell=dueH(due,st);
    // Si Hecho y tiene finReal > duedate → mostrar "Completada con atraso"
    if((st==='hecho'||st==='cancel')&&finReal&&due&&new Date(finReal)>new Date(due)){
      const days=Math.round((new Date(finReal)-new Date(due))/864e5);
      dueCell=`<span class="due-vencida">✓ +${days}d atraso (Fin: ${finReal})</span>`;
    }
    html+=`<tr><td><a href="${JIRA}/${k}" target="_blank">${k}</a></td><td>${s}</td><td>${badge(st)}</td><td>${spi.toFixed(2)}</td><td><span class="sem sem-${sm}"></span></td><td>${dueCell}</td></tr>`;
  });
  html+=`</tbody></table></div><a href="#tc" style="font-size:.85rem">↑ Volver</a></div></div>`;
});
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
html+=`<button onclick="copyInconsTable()" style="margin-bottom:1rem;padding:.5rem 1rem;background:var(--primary);color:var(--white);border:none;border-radius:var(--radius);cursor:pointer;font-size:.85rem">📋 Copiar tabla para Sheets</button><span id="copy-msg" style="margin-left:.5rem;font-size:.8rem;color:var(--success);display:none">✓ Copiado</span>`;
html+=`<div class="tw"><table id="tbl-incons"><thead><tr><th>Proyecto</th><th>Iniciativa</th><th>Key</th><th>Épica</th><th>Estado</th><th>Duedate</th></tr></thead><tbody>`;
inconsData.forEach(r=>{html+=`<tr><td>${r[0]}</td><td>${r[1]}</td><td><a href="${JIRA}/${r[2]}" target="_blank">${r[2]}</a></td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`;});
html+=`</tbody></table></div></div></div>`;
// Footer
html+=`</div><footer class="footer"><p>Dashboard Portafolio V3 — Gestión de la Demanda · Seguros Bolívar</p><p>Generado: ${TODAY_STR} · Reglas: 🟢 SPI≥1 · 🟡 SPI 0.8-0.99 o duedate vencida · 🔴 SPI&lt;0.8 · ⚪ Sin iniciar · ⚠️ Duedate vencida (En Progreso) · ✓ Completada (Hecho)</p></footer>
<script>function toggleDetail(el){var c=el.nextElementSibling,t=el.querySelector('.tg');if(c.classList.contains('open')){c.classList.remove('open');t.textContent='▼';}else{c.classList.add('open');t.textContent='▲';}}
function copyInconsTable(){var t=document.getElementById('tbl-incons');var rows=t.querySelectorAll('tr');var tsv=[];rows.forEach(function(r){var cells=r.querySelectorAll('th,td');var row=[];cells.forEach(function(c){row.push(c.textContent.trim());});tsv.push(row.join('\\t'));});navigator.clipboard.writeText(tsv.join('\\n')).then(function(){var m=document.getElementById('copy-msg');m.style.display='inline';setTimeout(function(){m.style.display='none';},2000);});}</script></body></html>`;
// Write file
const out=path.join(__dirname,'..','docs','portafolio-proyectos.html');
fs.writeFileSync(out,html,'utf8');
console.log('✅ HTML V3 generado:',out);
console.log(`   ${P.length} proyectos, ${totH+totP+totPH} épicas`);
