async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

const state = {
  lang: 'en',
  stats: null,
  attacks: null,
  carriers: null,
  map: null
};

function t(key) {
  return (window.I18N[state.lang] && window.I18N[state.lang][key]) || key;
}

function applyTranslations() {
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.getElementById('lang-toggle').textContent = state.lang === 'en' ? '中文' : 'EN';
}

function renderHeadline() {
  const { headline } = state.stats;
  document.getElementById('threat-level').textContent = headline.threatLevel;
  document.getElementById('threat-message').textContent = headline.message;
  const ts = document.getElementById('hero-ts');
  if (ts) ts.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

function renderThreatCards() {
  const container = document.getElementById('threat-cards');
  container.innerHTML = '';
  state.stats.threatCards.forEach((card) => {
    const el = document.createElement('article');
    el.className = `threat-card ${card.severity}`;
    el.innerHTML = `
      <div class="badge ${card.severity}">${state.lang === 'zh' ? card.statusZh : card.status}</div>
      <h3>${state.lang === 'zh' ? card.titleZh : card.title}</h3>
      <p>${card.detail}</p>
      <span class="card-reliability">Reliability: A2</span>
    `;
    container.appendChild(el);
  });
}

function renderKeyFigures() {
  const container = document.getElementById('key-figures');
  container.innerHTML = '';
  const dangerValues = ['-81%', '150+', '27', '72h'];
  state.stats.keyFigures.forEach((item) => {
    const el = document.createElement('article');
    const isDanger = dangerValues.includes(item.value);
    el.className = `stat-card${isDanger ? ' danger' : ''}`;
    el.innerHTML = `
      <span class="trend">${state.lang === 'zh' ? item.labelZh : item.label}</span>
      <h3>${item.value}</h3>
      <p>${item.note}</p>
    `;
    container.appendChild(el);
  });
}

function renderTimeline() {
  const container = document.getElementById('timeline-list');
  container.innerHTML = '';
  state.attacks.timeline.forEach((item, index) => {
    const el = document.createElement('article');
    el.className = 'timeline-item';
    el.innerHTML = `
      <div class="timeline-marker">
        <div class="timeline-dot" style="color:${item.color}; background:${item.color};"></div>
        ${index < state.attacks.timeline.length - 1 ? '<div class="timeline-line"></div>' : ''}
      </div>
      <div class="timeline-content">
        <p class="eyebrow">${item.period}</p>
        <h3>${t(item.phaseKey)}</h3>
        <p>${t(item.summaryKey)}</p>
        <ul>${item.details.map((detail) => `<li>${detail}</li>`).join('')}</ul>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderRerouteTable() {
  const tbody = document.getElementById('reroute-body');
  tbody.innerHTML = '';
  state.stats.rerouteComparison.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${state.lang === 'zh' ? row.metricZh : row.metric}</td>
      <td>${row.suez}</td>
      <td class="highlight-cell">${row.cape}</td>
    `;
    tbody.appendChild(tr);
  });
}

function statusClass(status) {
  if (/partial/i.test(status)) return 'status-partial';
  if (/normal/i.test(status)) return 'status-normal';
  return 'status-suspended';
}

function renderCarriers() {
  const tbody = document.getElementById('carrier-body');
  tbody.innerHTML = '';
  const reliabilities = ['A2', 'A1', 'B2', 'A2', 'B2', 'B3'];
  state.carriers.carriers.forEach((carrier, i) => {
    const tr = document.createElement('tr');
    const label = state.lang === 'zh' ? carrier.statusZh : carrier.status;
    tr.innerHTML = `
      <td><strong>${carrier.name}</strong></td>
      <td><span class="status-pill ${statusClass(carrier.status)}">${label}</span></td>
      <td>${carrier.region}</td>
      <td>${carrier.note}</td>
      <td class="reliability-cell">${reliabilities[i] || 'B2'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderGeopolitics() {
  const container = document.getElementById('geo-cards');
  container.innerHTML = '';
  state.stats.geopolitics.forEach((item) => {
    const el = document.createElement('article');
    el.className = 'geo-card panel';
    el.innerHTML = `
      <h3>${state.lang === 'zh' ? item.actorZh : item.actor}</h3>
      <p>${item.description}</p>
    `;
    container.appendChild(el);
  });
}

function renderAll() {
  applyTranslations();
  renderHeadline();
  renderThreatCards();
  renderKeyFigures();
  renderTimeline();
  renderRerouteTable();
  renderCarriers();
  renderGeopolitics();

  // Map
  const mapNode = document.getElementById('map');
  mapNode.innerHTML = '';
  if (state.map) { state.map.remove(); state.map = null; }
  state.map = window.renderThreatMap(state.attacks, state.lang);

  // Charts
  window.renderCharts(state.stats, state.lang);

  // Force graph
  if (window.ForceGraph) window.ForceGraph.setLang(state.lang);
}

async function init() {
  [state.attacks, state.stats, state.carriers] = await Promise.all([
    loadJson('data/attacks.json'),
    loadJson('data/stats.json'),
    loadJson('data/carriers.json')
  ]);

  renderAll();

  // Force graph
  if (window.ForceGraph) window.ForceGraph.init(state.lang);

  // NER demo
  if (window.NERDemo) window.NERDemo.init();

  // Intel ticker
  if (window.IntelTicker) window.IntelTicker.start();

  // Agent console
  if (window.AgentConsole) window.AgentConsole.start();

  // Language toggle
  document.getElementById('lang-toggle').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'zh' : 'en';
    renderAll();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init().catch((error) => {
    console.error(error);
    document.body.innerHTML = `<div style="padding:40px;color:#fff;font-family:Inter,sans-serif;">Dashboard failed to load data. ${error.message}</div>`;
  });
});
