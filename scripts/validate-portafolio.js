#!/usr/bin/env node
/**
 * Validates docs/portafolio-proyectos.html against live Jira data.
 * Compares epic counts, statuses, and AR per project.
 * 
 * Usage: node scripts/validate-portafolio.js
 */

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.resolve(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const JIRA_EMAIL = envVars.JIRA_EMAIL;
const JIRA_API_TOKEN = envVars.JIRA_API_TOKEN;
const JIRA_BASE = 'jirasegurosbolivar.atlassian.net';

const PROJECTS = [
  'GD902', 'GD903', 'GD904', 'GD905', 'GD907', 'GD929',
  'GD951', 'GD971', 'GD981', 'GD1129', 'GD1130', 'GD1136',
  'GD1141', 'GD1145', 'GD1146', 'GD1147', 'GD1151', 'GD1152', 'GD1153', 'GD1154'
];

function jiraSearch(jql, fields = ['summary', 'status'], startAt = 0) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({ jql, fields: fields.join(','), startAt: String(startAt), maxResults: '100' });
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    const req = https.request({
      hostname: JIRA_BASE,
      path: `/rest/api/3/search/jql?${params.toString()}`,
      method: 'GET',
      headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`Jira ${res.statusCode}: ${data.substring(0, 150)}`));
        else resolve(JSON.parse(data));
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function getAllEpics(projectKey) {
  const jql = `project = ${projectKey} AND issuetype = Epic ORDER BY key ASC`;
  let all = [];
  let startAt = 0;
  let isLast = false;
  while (!isLast) {
    const r = await jiraSearch(jql, ['summary', 'status'], startAt);
    all = all.concat(r.issues || []);
    isLast = r.isLast !== false;
    startAt += (r.issues || []).length;
  }
  // Exclude Guías
  return all.filter(i => {
    const s = i.fields.summary.toLowerCase();
    return !s.startsWith('guía') && !s.startsWith('guia') && !s.match(/^gd[\s-]?\d+\s+guía/i) && !s.match(/^gd[\s-]?\d+\s+guia/i);
  });
}

async function getChildrenDoneCount(epicKey) {
  const jql = `parentEpic = ${epicKey}`;
  const r = await jiraSearch(jql, ['status'], 0);
  const issues = r.issues || [];
  let done = 0;
  for (const i of issues) {
    if (i.fields.status.statusCategory.key === 'done') done++;
  }
  return { total: issues.length, done };
}

// Parse HTML to extract dashboard data
function parseHTML() {
  const htmlPath = path.resolve(__dirname, '..', 'docs', 'portafolio-proyectos.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Extract project AR from detail sections
  const projectData = {};
  const regex = /id="([^"]+)".*?<h3>([^<]+)<\/h3>/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const id = m[1]; // e.g. "gd902"
    const title = m[2];
    const arMatch = title.match(/AR:\s*([\d.]+)%/);
    const epicMatch = title.match(/\((\d+)\s+épicas?\)/);
    if (arMatch) {
      projectData[id] = {
        ar: parseFloat(arMatch[1]),
        totalEpics: epicMatch ? parseInt(epicMatch[1]) : 0,
      };
    }
  }
  return projectData;
}

async function main() {
  console.log('=== VALIDACIÓN: Dashboard vs Jira en Vivo ===\n');

  const dashboardData = parseHTML();
  let discrepancies = 0;
  let validated = 0;

  for (const proj of PROJECTS) {
    const id = proj.toLowerCase();
    const dashProj = dashboardData[id];

    // Get live Jira data
    const epics = await getAllEpics(proj);
    const totalEpics = epics.length;

    // Count by status
    let done = 0, inProgress = 0, todo = 0, cancelled = 0;
    for (const e of epics) {
      const statusName = e.fields.status.name;
      const cat = e.fields.status.statusCategory.key;
      if (statusName === 'Cancelado') cancelled++;
      else if (cat === 'done') done++;
      else if (cat === 'indeterminate') inProgress++;
      else todo++;
    }

    // Calculate AR from children for non-done, non-cancelled epics
    const active = epics.filter(e => e.fields.status.name !== 'Cancelado');
    let arSum = 0;
    for (const e of active) {
      const cat = e.fields.status.statusCategory.key;
      if (cat === 'done') {
        arSum += 100;
      } else {
        const stats = await getChildrenDoneCount(e.key);
        const epicAR = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;
        arSum += epicAR;
      }
    }
    const liveAR = active.length > 0 ? Math.round((arSum / active.length) * 10) / 10 : 0;

    // Compare
    const dashAR = dashProj ? dashProj.ar : null;
    const dashEpics = dashProj ? dashProj.totalEpics : null;
    const arMatch = dashAR !== null && Math.abs(dashAR - liveAR) < 1; // tolerance 1%
    const epicMatch = dashEpics === totalEpics;

    if (arMatch && epicMatch) {
      console.log(`✅ ${proj}: AR ${liveAR}% (dash: ${dashAR}%) | Épicas: ${totalEpics} (dash: ${dashEpics}) | Done:${done} Prog:${inProgress} Todo:${todo} Canc:${cancelled}`);
      validated++;
    } else {
      console.log(`❌ ${proj}: DISCREPANCIA`);
      if (!arMatch) console.log(`   AR: Jira=${liveAR}% vs Dashboard=${dashAR}%`);
      if (!epicMatch) console.log(`   Épicas: Jira=${totalEpics} vs Dashboard=${dashEpics}`);
      console.log(`   Jira real: Done:${done} Prog:${inProgress} Todo:${todo} Canc:${cancelled}`);
      discrepancies++;
    }
  }

  console.log(`\n=== RESULTADO ===`);
  console.log(`Validados: ${validated}/20`);
  console.log(`Discrepancias: ${discrepancies}/20`);
  if (discrepancies === 0) console.log('✅ TODOS LOS PROYECTOS COINCIDEN CON JIRA');
  else console.log('⚠️ HAY DISCREPANCIAS — revisar proyectos marcados con ❌');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
