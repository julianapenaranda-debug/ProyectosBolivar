#!/usr/bin/env node
/**
 * Genera docs/portafolio-excelencias-operativas.html con datos de Jira.
 * Consulta todas las EOs (Excelencias Operativas) de la gerencia,
 * cuenta épicas por estado y HU en progreso por EO.
 * Run: node scripts/generate-eo-dashboard.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

// Carga .env sin dependencias externas
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const eq = t.indexOf('=');
    if (eq === -1) return;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  });
}

const JIRA_BASE = 'https://jirasegurosbolivar.atlassian.net';
const JIRA_BROWSE = `${JIRA_BASE}/browse`;
const TODAY = new Date();
const TODAY_STR = TODAY.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
const RATE_LIMIT_MS = 250;
const EXCLUDED_EO = 'GD989-192';
const EXCLUDED_EOS = ['GD989-192', 'AUTQA-7987', 'E2ARPA-303', 'GD815-2808', 'CONECTA-4666', 'PERF-598'];

// ═══════════════════════════════════════════════════════════════════
// FUNCIONES DE API
// ═══════════════════════════════════════════════════════════════════

/** @returns {{ email: string, token: string }} */
function validateCredentials() {
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  if (!email || !token) { console.error('Error: JIRA_EMAIL y JIRA_API_TOKEN requeridos.'); process.exit(1); }
  return { email, token };
}

/** @param {string} email @param {string} token @returns {string} */
function buildAuthHeader(email, token) {
  return 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64');
}

/** @param {string} url @param {string} auth @returns {Promise<object>} */
function jiraFetch(url, auth) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: auth, Accept: 'application/json' } }, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`Jira ${res.statusCode}: ${d.slice(0, 200)}`));
        resolve(JSON.parse(d));
      });
    }).on('error', reject);
  });
}

/** @param {number} ms @returns {Promise<void>} */
function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

/**
 * Busca todas las EOs activas.
 * @param {string} auth - Auth header.
 * @returns {Promise<Array>} Lista de issues EO.
 */
async function fetchAllEOs(auth) {
  const jql = 'issuetype = Iniciativa AND summary ~ "EO 2026" AND statusCategory != Done ORDER BY key ASC';
  const fields = 'summary,status,project';
  const allIssues = [];
  let startAt = 0;
  let hasMore = true;
  while (hasMore) {
    const params = new URLSearchParams({ jql, fields, startAt: String(startAt), maxResults: '100' });
    const url = `${JIRA_BASE}/rest/api/3/search/jql?${params}`;
    const resp = await jiraFetch(url, auth);
    allIssues.push(...resp.issues);
    startAt += resp.issues.length;
    hasMore = resp.issues.length === 100;
    if (hasMore) await delay(RATE_LIMIT_MS);
  }
  return allIssues.filter((i) => !EXCLUDED_EOS.includes(i.key));
}

/**
 * Cuenta épicas por estado para una EO.
 * @param {string} eoKey - Key de la EO.
 * @param {string} auth - Auth header.
 * @returns {Promise<{total:number,done:number,prog:number,back:number}>}
 */
async function countEpicsByStatus(eoKey, auth) {
  const jql = `parent = ${eoKey} AND issuetype = Epic`;
  const params = new URLSearchParams({ jql, fields: 'status,customfield_29596', maxResults: '100' });
  const url = `${JIRA_BASE}/rest/api/3/search/jql?${params}`;
  const resp = await jiraFetch(url, auth);
  let done = 0, prog = 0, back = 0;
  const tipos = {};
  resp.issues.forEach((i) => {
    const cat = (i.fields.status.statusCategory || {}).key;
    if (cat === 'done') done++;
    else if (cat === 'indeterminate') prog++;
    else back++;
    const tipo = i.fields.customfield_29596 ? i.fields.customfield_29596.value : 'Sin clasificar';
    tipos[tipo] = (tipos[tipo] || 0) + 1;
  });
  return { total: resp.issues.length, done, prog, back, tipos };
}

/**
 * Cuenta HU en progreso para épicas de una EO.
 * @param {string} eoKey - Key de la EO.
 * @param {string} auth - Auth header.
 * @returns {Promise<number>} Total HU en progreso.
 */
async function countHuInProgress(eoKey, auth) {
  const jql = `"Epic Link" in epicChildrenOf("${eoKey}") AND statusCategory = "In Progress"`;
  const params = new URLSearchParams({ jql, fields: 'key', maxResults: '1' });
  const url = `${JIRA_BASE}/rest/api/3/search/jql?${params}`;
  try {
    const resp = await jiraFetch(url, auth);
    return resp.issues ? resp.issues.length : 0;
  } catch { return 0; }
}

// ═══════════════════════════════════════════════════════════════════
// GENERACIÓN HTML
// ═══════════════════════════════════════════════════════════════════

/**
 * Genera el HTML del dashboard de EOs.
 * @param {Array} eoData - Array de {key, name, total, done, prog, back, hu}.
 * @returns {string} HTML completo.
 */
function generateHtml(eoData) {
  const totEO = eoData.length;
  const totEpics = eoData.reduce((s, e) => s + e.total, 0);
  const totDone = eoData.reduce((s, e) => s + e.done, 0);
  const totProg = eoData.reduce((s, e) => s + e.prog, 0);
  const totBack = eoData.reduce((s, e) => s + e.back, 0);
  const totHU = eoData.reduce((s, e) => s + e.hu, 0);
  const pDone = totEpics > 0 ? Math.round((totDone / totEpics) * 100) : 0;
  const pProg = totEpics > 0 ? Math.round((totProg / totEpics) * 100) : 0;
  const pBack = 100 - pDone - pProg;

  // Consolidar tipos de requerimiento
  const tiposGlobal = {};
  eoData.forEach((eo) => { Object.entries(eo.tipos || {}).forEach(([t, c]) => { tiposGlobal[t] = (tiposGlobal[t] || 0) + c; }); });
  const tiposSorted = Object.entries(tiposGlobal).sort((a, b) => b[1] - a[1]);
  const tipoColors = { 'Entrega de Valor': '#1565c0', 'Disponibilidad y Estabilidad': '#2e7d32', 'Obsolescencia Tecnológica': '#f57f17', 'Ciberseguridad': '#c62828', 'Normativo Externo': '#6a1b9a', 'Normativo Interno': '#6a1b9a', 'Deuda Técnica': '#546e7a', 'Sin clasificar': '#bdbdbd' };

  const dataJson = JSON.stringify(eoData);

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Dashboard Excelencias Operativas 2026 — GD | Seguros Bolívar</title>
<style>:root{--primary:#1a237e;--primary-light:#283593;--primary-dark:#0d1642;--white:#fff;--gray-50:#f8f9fa;--gray-100:#f1f3f5;--gray-200:#e9ecef;--gray-400:#ced4da;--gray-500:#adb5bd;--gray-600:#868e96;--gray-800:#343a40;--success:#2e7d32;--success-bg:#e8f5e9;--warning:#f57f17;--warning-bg:#fff8e1;--danger:#c62828;--danger-bg:#ffebee;--neutral:#546e7a;--neutral-bg:#eceff1;--font:system-ui,-apple-system,sans-serif;--radius:8px;--shadow:0 2px 8px rgba(26,35,126,.08)}*{margin:0;padding:0;box-sizing:border-box}body{font-family:var(--font);background:var(--gray-50);color:var(--gray-800);line-height:1.5}a{color:var(--primary);text-decoration:none}a:hover{text-decoration:underline}.header{background:linear-gradient(135deg,var(--primary-dark),var(--primary));color:var(--white);padding:2rem 1.5rem;text-align:center}.header h1{font-size:1.75rem;font-weight:700;margin-bottom:.25rem}.header .sub{font-size:1rem;opacity:.85}.header .date{font-size:.85rem;opacity:.7;margin-top:.5rem}.header .vb{display:inline-block;background:rgba(255,255,255,.15);padding:.2rem .6rem;border-radius:12px;font-size:.75rem;margin-top:.5rem}.container{max-width:1400px;margin:0 auto;padding:1.5rem}.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem}.kpi-card{background:var(--white);border-radius:var(--radius);padding:1.25rem;box-shadow:var(--shadow);text-align:center;border-top:3px solid var(--primary)}.kpi-card .v{font-size:2rem;font-weight:700;color:var(--primary)}.kpi-card .l{font-size:.82rem;color:var(--gray-600);margin-top:.25rem}.kpi-card.s{border-top-color:var(--success)}.kpi-card.s .v{color:var(--success)}.kpi-card.w{border-top-color:var(--warning)}.kpi-card.w .v{color:var(--warning)}.kpi-card.n{border-top-color:var(--neutral)}.kpi-card.n .v{color:var(--neutral)}.st{font-size:1.25rem;font-weight:700;color:var(--primary);margin:2rem 0 1rem;padding-bottom:.5rem;border-bottom:2px solid var(--gray-200)}.tw{overflow-x:auto;background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:2rem}table{width:100%;border-collapse:collapse;font-size:.85rem}thead{background:var(--primary);color:var(--white)}th{padding:.7rem .8rem;text-align:left;font-weight:600;white-space:nowrap}td{padding:.6rem .8rem;border-bottom:1px solid var(--gray-200)}tbody tr:hover{background:var(--gray-100)}.progress-bar{background:var(--gray-200);border-radius:10px;height:18px;width:100%;min-width:120px;overflow:hidden;display:flex}.progress-fill-done{height:100%;background:var(--success)}.progress-fill-prog{height:100%;background:var(--warning)}.progress-fill-back{height:100%;background:var(--gray-400)}.badge{display:inline-block;padding:.15rem .5rem;border-radius:12px;font-size:.72rem;font-weight:600;white-space:nowrap}.badge-done{background:var(--success-bg);color:var(--success)}.badge-prog{background:var(--warning-bg);color:var(--warning)}.badge-back{background:var(--neutral-bg);color:var(--neutral)}.filter-bar{display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:1.5rem;align-items:center}.filter-bar label{font-size:.85rem;color:var(--gray-600)}.sort-btn{padding:.35rem .7rem;border:1px solid var(--gray-400);border-radius:var(--radius);background:var(--white);cursor:pointer;font-size:.8rem}.sort-btn:hover{background:var(--gray-100)}.sort-btn.active{background:var(--primary);color:var(--white);border-color:var(--primary)}.filter-bar input{padding:.4rem .6rem;border:1px solid var(--gray-400);border-radius:var(--radius);font-size:.85rem}.footer{text-align:center;padding:2rem 1rem;font-size:.8rem;color:var(--gray-500);border-top:1px solid var(--gray-200);margin-top:2rem}@media(max-width:768px){.header h1{font-size:1.3rem}.kpi-grid{grid-template-columns:repeat(2,1fr)}th,td{padding:.4rem .5rem;font-size:.78rem}}</style></head><body>
<header class="header"><h1>Dashboard Excelencias Operativas 2026</h1><div class="sub">Seguros Bolívar · Vicepresidencia de Tecnología · Gestión de la Demanda</div><div class="date">${TODAY_STR}</div><div class="vb">${totEO} EOs · Épicas por estado</div></header>
<div class="container">
<h2 class="st">Indicadores Clave</h2>
<div class="kpi-grid">
<div class="kpi-card"><div class="v">${totEO}</div><div class="l">Excelencias Operativas</div></div>
<div class="kpi-card"><div class="v">${totEpics}</div><div class="l">Total Épicas</div></div>
<div class="kpi-card s"><div class="v">${totDone}</div><div class="l">Épicas Done (${pDone}%)</div></div>
<div class="kpi-card w"><div class="v">${totProg}</div><div class="l">Épicas En Progreso (${pProg}%)</div></div>
<div class="kpi-card n"><div class="v">${totBack}</div><div class="l">Épicas Backlog (${pBack}%)</div></div>
<div class="kpi-card w"><div class="v">${totHU.toLocaleString()}</div><div class="l">HU En Progreso (total)</div></div>
</div>
<h2 class="st">Distribución Global de Épicas</h2>
<div style="margin-bottom:2rem"><div class="progress-bar" style="height:28px;border-radius:14px;font-size:.8rem">
<div class="progress-fill-done" style="width:${pDone}%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600">Done ${pDone}%</div>
<div class="progress-fill-prog" style="width:${pProg}%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600">En Progreso ${pProg}%</div>
<div class="progress-fill-back" style="width:${pBack}%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600">Backlog ${pBack}%</div>
</div></div>
<h2 class="st">Distribución por Tipo de Requerimiento</h2>
<div class="tw"><table><thead><tr><th>Tipo de Requerimiento</th><th style="text-align:center">Épicas</th><th style="text-align:center">%</th><th>Distribución</th></tr></thead><tbody>
${tiposSorted.map(([tipo, count]) => { const pct = Math.round((count / totEpics) * 100); const color = tipoColors[tipo] || '#78909c'; return `<tr><td><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${color};margin-right:8px;vertical-align:middle"></span>${tipo}</td><td style="text-align:center;font-weight:700">${count}</td><td style="text-align:center;font-weight:700">${pct}%</td><td><div class="progress-bar" style="height:14px"><div class="progress-fill-done" style="width:${pct}%;background:${color}"></div></div></td></tr>`; }).join('')}
</tbody></table></div>
<h2 class="st" id="tabla">Tabla de Excelencias Operativas</h2>
<div class="filter-bar">
<label>Ordenar:</label>
<button class="sort-btn active" onclick="sortTable('epicas')">Por # Épicas</button>
<button class="sort-btn" onclick="sortTable('nombre')">Por Nombre</button>
<button class="sort-btn" onclick="sortTable('hu')">Por HU EnProg</button>
<input type="text" id="filtro" placeholder="Filtrar por nombre..." oninput="filtrarTabla()" style="margin-left:auto;width:200px">
</div>
<div class="tw"><table id="eoTable"><thead><tr><th>#</th><th>Key</th><th>Nombre EO</th><th>Épicas</th><th>Done</th><th>En Prog</th><th>Backlog</th><th>HU EnProg</th></tr></thead><tbody id="tbody"></tbody></table></div>
</div>
<script>
var EO_DATA=${dataJson};
var currentSort='epicas';
function renderTable(data){var tb=document.getElementById('tbody');tb.innerHTML='';data.forEach(function(eo,i){tb.innerHTML+='<tr><td>'+(i+1)+'</td><td><a href="${JIRA_BROWSE}/'+eo.key+'" target="_blank">'+eo.key+'</a></td><td>'+eo.name+'</td><td style="text-align:center;font-weight:600">'+eo.total+'</td><td style="text-align:center"><span class="badge badge-done">'+eo.done+'</span></td><td style="text-align:center"><span class="badge badge-prog">'+eo.prog+'</span></td><td style="text-align:center"><span class="badge badge-back">'+eo.back+'</span></td><td style="text-align:center;font-weight:700;color:'+(eo.hu>50?'var(--danger)':eo.hu>20?'var(--warning)':'var(--gray-800)')+'">'+eo.hu+'</td></tr>';});}
function sortTable(by){currentSort=by;document.querySelectorAll('.sort-btn').forEach(function(b){b.classList.remove('active');});event.target.classList.add('active');var s=EO_DATA.slice();if(by==='epicas')s.sort(function(a,b){return b.total-a.total;});else if(by==='hu')s.sort(function(a,b){return b.hu-a.hu;});else s.sort(function(a,b){return a.name.localeCompare(b.name);});renderTable(s);}
function filtrarTabla(){var f=document.getElementById('filtro').value.toLowerCase();var fl=EO_DATA.filter(function(eo){return eo.name.toLowerCase().indexOf(f)!==-1||eo.key.toLowerCase().indexOf(f)!==-1;});var s=fl.slice();if(currentSort==='epicas')s.sort(function(a,b){return b.total-a.total;});else if(currentSort==='hu')s.sort(function(a,b){return b.hu-a.hu;});else s.sort(function(a,b){return a.name.localeCompare(b.name);});renderTable(s);}
EO_DATA.sort(function(a,b){return b.total-a.total;});renderTable(EO_DATA);
</script>
<footer class="footer">Dashboard Excelencias Operativas 2026 · Gestión de la Demanda · Seguros Bolívar<br>Generado: ${TODAY_STR} · Fuente: Jira API (dinámico)</footer>
</body></html>`;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  const { email, token } = validateCredentials();
  const auth = buildAuthHeader(email, token);

  console.log('🔄 Consultando Excelencias Operativas desde Jira...');
  const eos = await fetchAllEOs(auth);
  console.log(`  → ${eos.length} EOs encontradas (excluida ${EXCLUDED_EO})`);

  const eoData = [];
  for (let i = 0; i < eos.length; i++) {
    const eo = eos[i];
    const epicStats = await countEpicsByStatus(eo.key, auth);
    await delay(RATE_LIMIT_MS);

    // Contar HU en progreso por épica
    let hu = 0;
    if (epicStats.prog > 0) {
      const epJql = `parent = ${eo.key} AND issuetype = Epic AND statusCategory = "In Progress"`;
      const epParams = new URLSearchParams({ jql: epJql, fields: 'key', maxResults: '100' });
      const epUrl = `${JIRA_BASE}/rest/api/3/search/jql?${epParams}`;
      try {
        const epResp = await jiraFetch(epUrl, auth);
        for (const ep of epResp.issues) {
          const huJql = `parent = ${ep.key} AND statusCategory = "In Progress"`;
          const huParams = new URLSearchParams({ jql: huJql, fields: 'key', maxResults: '100' });
          const huUrl = `${JIRA_BASE}/rest/api/3/search/jql?${huParams}`;
          const huResp = await jiraFetch(huUrl, auth);
          hu += huResp.issues.length;
          await delay(RATE_LIMIT_MS);
        }
      } catch { hu = 0; }
    }

    eoData.push({
      key: eo.key,
      name: eo.fields.summary,
      total: epicStats.total,
      done: epicStats.done,
      prog: epicStats.prog,
      back: epicStats.back,
      hu,
      tipos: epicStats.tipos
    });

    if ((i + 1) % 10 === 0) console.log(`  → Procesadas ${i + 1}/${eos.length}...`);
  }

  console.log(`  ✓ ${eoData.length} EOs procesadas`);

  // Filtrar EOs sin actividad (sin HU en progreso, sin épicas prog o backlog)
  const activeEOs = eoData.filter((eo) => eo.hu > 0 || eo.prog > 0 || eo.back > 0);
  console.log(`  → ${activeEOs.length} EOs activas (excluidas ${eoData.length - activeEOs.length} sin actividad)`);

  const outPath = path.join(__dirname, '..', 'docs', 'portafolio-excelencias-operativas.html');
  const html = generateHtml(activeEOs);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`✅ Dashboard EO generado: ${outPath}`);
  console.log(`   EOs: ${eoData.length} | Épicas: ${eoData.reduce((s, e) => s + e.total, 0)} | HU EnProg: ${eoData.reduce((s, e) => s + e.hu, 0)}`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
