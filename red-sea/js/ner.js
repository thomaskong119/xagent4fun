/* ── AI Entity Extraction (NER) Demo ── */
window.NERDemo = (function () {
  const rawText = `On February 28, 2026, the United States and Israel launched coordinated military operations — Operation Epic Fury and Operation Roaring Lion — targeting military and nuclear facilities across Tehran, Isfahan, Qom, Karaj, and Kermanshah. Iran immediately mounted large-scale retaliation, launching Shahab-3 ballistic missiles and Shahed-136 drones at 27 US military bases across the Middle East, striking targets in Bahrain, Iraq, Jordan, Kuwait, Oman, Qatar, Saudi Arabia, UAE, and Cyprus.

The Islamic Revolutionary Guard Corps (IRGC) blockaded the Strait of Hormuz on March 1, with Commander Hossein Salami declaring the strait closed to all vessel traffic. Over 150 vessels were stranded near Fujairah anchorage, including the tankers MT Nordic Zenith and MT Caspian Star. Qatar's LNG facilities at Ras Laffan were attacked, threatening 20% of global LNG supply.

On March 2, Houthi leader Abdul-Malik al-Houthi announced the resumption of Red Sea attacks. The bulk carriers Magic Seas and Eternity C, sunk near Hodeidah in July 2025, remained stark reminders of earlier Houthi maritime capabilities. Major carriers — Maersk, CMA CGM, COSCO, MSC, and Hapag-Lloyd — suspended all Middle East bookings. French President Emmanuel Macron dispatched 10 warships including the frigate FS Alsace for escort operations.`;

  const entities = [
    { text: 'United States', type: 'org', confidence: 0.99 },
    { text: 'Israel', type: 'location', confidence: 0.98 },
    { text: 'Operation Epic Fury', type: 'org', confidence: 0.96 },
    { text: 'Operation Roaring Lion', type: 'org', confidence: 0.95 },
    { text: 'Tehran', type: 'location', confidence: 0.99 },
    { text: 'Isfahan', type: 'location', confidence: 0.98 },
    { text: 'Qom', type: 'location', confidence: 0.97 },
    { text: 'Karaj', type: 'location', confidence: 0.96 },
    { text: 'Kermanshah', type: 'location', confidence: 0.97 },
    { text: 'Iran', type: 'location', confidence: 0.99 },
    { text: 'Shahab-3', type: 'weapon', confidence: 0.94 },
    { text: 'Shahed-136', type: 'weapon', confidence: 0.95 },
    { text: 'Bahrain', type: 'location', confidence: 0.98 },
    { text: 'Iraq', type: 'location', confidence: 0.99 },
    { text: 'Jordan', type: 'location', confidence: 0.98 },
    { text: 'Kuwait', type: 'location', confidence: 0.98 },
    { text: 'Oman', type: 'location', confidence: 0.97 },
    { text: 'Qatar', type: 'location', confidence: 0.98 },
    { text: 'Saudi Arabia', type: 'location', confidence: 0.99 },
    { text: 'UAE', type: 'location', confidence: 0.98 },
    { text: 'Cyprus', type: 'location', confidence: 0.96 },
    { text: 'Islamic Revolutionary Guard Corps', type: 'org', confidence: 0.98 },
    { text: 'IRGC', type: 'org', confidence: 0.97 },
    { text: 'Strait of Hormuz', type: 'location', confidence: 0.99 },
    { text: 'Hossein Salami', type: 'person', confidence: 0.93 },
    { text: 'Fujairah', type: 'location', confidence: 0.97 },
    { text: 'MT Nordic Zenith', type: 'vessel', confidence: 0.91 },
    { text: 'MT Caspian Star', type: 'vessel', confidence: 0.90 },
    { text: 'Ras Laffan', type: 'location', confidence: 0.96 },
    { text: 'Abdul-Malik al-Houthi', type: 'person', confidence: 0.95 },
    { text: 'Red Sea', type: 'location', confidence: 0.99 },
    { text: 'Magic Seas', type: 'vessel', confidence: 0.92 },
    { text: 'Eternity C', type: 'vessel', confidence: 0.93 },
    { text: 'Hodeidah', type: 'location', confidence: 0.97 },
    { text: 'Maersk', type: 'org', confidence: 0.99 },
    { text: 'CMA CGM', type: 'org', confidence: 0.98 },
    { text: 'COSCO', type: 'org', confidence: 0.98 },
    { text: 'MSC', type: 'org', confidence: 0.97 },
    { text: 'Hapag-Lloyd', type: 'org', confidence: 0.97 },
    { text: 'Emmanuel Macron', type: 'person', confidence: 0.98 },
    { text: 'FS Alsace', type: 'vessel', confidence: 0.89 },
  ];

  const typeColors = {
    person: '#38bdf8',
    org: '#34d399',
    location: '#f43f5e',
    vessel: '#a78bfa',
    weapon: '#fbbf24'
  };

  let animationTimer = null;

  function highlightText() {
    let html = rawText;
    // Sort by length desc to avoid partial matches
    const sorted = [...entities].sort((a, b) => b.text.length - a.text.length);
    sorted.forEach((ent) => {
      const re = new RegExp(ent.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      html = html.replace(re, `<mark class="ner-highlight ${ent.type}" style="--ner-color:${typeColors[ent.type]}">${ent.text}</mark>`);
    });
    return html;
  }

  function renderEntities(containerEl) {
    containerEl.innerHTML = '';
    const grouped = {};
    entities.forEach((e) => {
      if (!grouped[e.type]) grouped[e.type] = [];
      // Deduplicate
      if (!grouped[e.type].find((x) => x.text === e.text)) {
        grouped[e.type].push(e);
      }
    });

    const order = ['person', 'org', 'location', 'vessel', 'weapon'];
    const labels = { person: 'PERSONS', org: 'ORGANIZATIONS', location: 'LOCATIONS', vessel: 'VESSELS', weapon: 'WEAPONS' };

    order.forEach((type) => {
      if (!grouped[type]) return;
      const group = document.createElement('div');
      group.className = 'ner-group';
      group.innerHTML = `<h4 class="ner-group-title" style="color:${typeColors[type]}">${labels[type]} (${grouped[type].length})</h4>`;
      
      grouped[type].forEach((ent, i) => {
        const chip = document.createElement('div');
        chip.className = `ner-chip ${type}`;
        chip.style.animationDelay = `${i * 0.08}s`;
        chip.innerHTML = `
          <span class="chip-name">${ent.text}</span>
          <span class="chip-conf">${(ent.confidence * 100).toFixed(0)}%</span>
          <div class="conf-bar"><div class="conf-fill" style="width:${ent.confidence * 100}%;background:${typeColors[type]}"></div></div>
        `;
        group.appendChild(chip);
      });

      containerEl.appendChild(group);
    });
  }

  function animateExtraction() {
    const textEl = document.getElementById('ner-text');
    const entEl = document.getElementById('ner-entities');
    if (!textEl || !entEl) return;

    // Phase 1: show raw text
    textEl.innerHTML = `<span class="raw-text">${rawText.replace(/\n\n/g, '<br><br>')}</span>`;
    textEl.classList.add('scanning');
    entEl.innerHTML = '<div class="ner-processing">⟳ Processing 847 tokens across 3 paragraphs...</div>';

    // Phase 2: highlight
    if (animationTimer) clearTimeout(animationTimer);
    animationTimer = setTimeout(() => {
      textEl.classList.remove('scanning');
      textEl.innerHTML = highlightText().replace(/\n\n/g, '<br><br>');
      
      // Phase 3: show entities
      setTimeout(() => {
        renderEntities(entEl);
      }, 600);
    }, 2500);
  }

  function init() {
    animateExtraction();
    const btn = document.getElementById('ner-replay');
    if (btn) btn.addEventListener('click', animateExtraction);
  }

  return { init };
})();
