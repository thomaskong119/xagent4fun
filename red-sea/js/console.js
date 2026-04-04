/* ── Agent Processing Console ── */
window.AgentConsole = (function () {
  const lines = [
    { delay: 0, text: '> X-AGENT v3.2.1 — Intelligence Processing Engine initialized', style: 'header' },
    { delay: 400, text: '> Connecting to 847 OSINT data sources...', style: 'info' },
    { delay: 800, text: '  ✓ Reuters Maritime (connected)', style: 'success' },
    { delay: 1000, text: '  ✓ Lloyd\'s List Intelligence (connected)', style: 'success' },
    { delay: 1200, text: '  ✓ MarineTraffic AIS (connected)', style: 'success' },
    { delay: 1400, text: '  ✓ Sentinel-2 GEOINT feed (connected)', style: 'success' },
    { delay: 1600, text: '  ✓ IRGC SIGINT intercept archive (connected)', style: 'success' },
    { delay: 2000, text: '> Scanning 12,847 documents from past 72 hours...', style: 'info' },
    { delay: 2800, text: '> NLP Pipeline: Tokenizing in 40+ languages', style: 'info' },
    { delay: 3200, text: '  Processing: en(6,412) ar(2,891) fa(1,847) fr(892) zh(805)', style: 'dim' },
    { delay: 3800, text: '> Entity extraction complete: 2,341 entities identified', style: 'info' },
    { delay: 4200, text: '  PERSONS: 187 | ORGS: 342 | LOCATIONS: 891 | VESSELS: 234 | WEAPONS: 89', style: 'dim' },
    { delay: 4800, text: '> Cross-referencing AIS vessel tracking data...', style: 'info' },
    { delay: 5400, text: '  WARNING: 47 vessels show AIS signal anomalies near Hormuz', style: 'warn' },
    { delay: 5800, text: '  WARNING: 12 vessels with last known position inside exclusion zone', style: 'warn' },
    { delay: 6200, text: '> Geospatial fusion: Overlaying GEOINT with OSINT timeline', style: 'info' },
    { delay: 6800, text: '> Threat assessment matrix generated', style: 'info' },
    { delay: 7200, text: '  Hormuz: CRITICAL (confidence 0.97)', style: 'danger' },
    { delay: 7400, text: '  Bab el-Mandeb: HIGH (confidence 0.94)', style: 'warn' },
    { delay: 7600, text: '  Suez Canal: CRITICAL (confidence 0.96)', style: 'danger' },
    { delay: 8000, text: '> Generating NATO-compatible intelligence brief...', style: 'info' },
    { delay: 8400, text: '> Reliability scoring: A1-F6 matrix applied to all sources', style: 'info' },
    { delay: 8800, text: '> Report compiled: 5 sections, 41 entities, 8 key indicators', style: 'info' },
    { delay: 9200, text: '> Classification: UNCLASSIFIED // FOR DEMONSTRATION', style: 'header' },
    { delay: 9600, text: '', style: 'blank' },
    { delay: 9800, text: '═══════════════════════════════════════════════════════', style: 'header' },
    { delay: 10000, text: '  INTELLIGENCE PRODUCT READY — DASHBOARD RENDERED', style: 'header' },
    { delay: 10200, text: '  Sources: 847 feeds | Entities: 2,341 | Languages: 40+', style: 'dim' },
    { delay: 10400, text: '  Generated: 2026-04-05T00:00:00Z | X-Agent / Stonehenge AI', style: 'dim' },
    { delay: 10600, text: '═══════════════════════════════════════════════════════', style: 'header' },
  ];

  function start() {
    const container = document.getElementById('console-output');
    if (!container) return;

    lines.forEach((line) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = `console-line ${line.style}`;
        el.textContent = line.text;
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
      }, line.delay);
    });
  }

  return { start };
})();
