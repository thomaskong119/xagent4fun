/* ── Intel Ticker — simulated live OSINT feed ── */
window.IntelTicker = (function () {
  const messages = [
    { time: '2026-04-04 23:14 UTC', src: 'OSINT/A2', text: 'MV GLORY rerouted via Cape of Good Hope — AIS signal lost at 12.4°N 43.2°E' },
    { time: '2026-04-04 22:47 UTC', src: 'AIS/B1', text: 'Hormuz Strait vessel count: 38 (baseline: 200-300/day) — 81% reduction confirmed' },
    { time: '2026-04-04 21:33 UTC', src: 'OSINT/A1', text: 'CMA CGM resumes partial ME bookings w/ USD 2000-3000 surcharge — first carrier to return' },
    { time: '2026-04-04 20:15 UTC', src: 'SIGINT/B2', text: 'IRGC VHF broadcast intercepted: "The strait is closed. Anyone who tries to pass will be set ablaze."' },
    { time: '2026-04-04 19:58 UTC', src: 'GEOINT/A2', text: 'Satellite imagery confirms 150+ vessels holding position near Fujairah anchorage' },
    { time: '2026-04-04 18:22 UTC', src: 'OSINT/A1', text: 'French Navy deploys 10 warships to Hormuz/Red Sea — largest deployment in recent years' },
    { time: '2026-04-04 17:45 UTC', src: 'AIS/A2', text: 'Suez Canal northbound transit count: 3 vessels (pre-crisis daily avg: 72)' },
    { time: '2026-04-04 16:30 UTC', src: 'OSINT/B2', text: 'Houthi spokesperson: "All American and Israeli ships are legitimate targets in solidarity with Iran"' },
    { time: '2026-04-04 15:12 UTC', src: 'SIGINT/A3', text: 'Qatar Ras Laffan LNG terminal — intermittent GPS degradation detected, possible jamming' },
    { time: '2026-04-04 14:05 UTC', src: 'OSINT/A1', text: 'P&I clubs issue 72h war risk cancellation — effective 00:00 GMT March 5, 2026' },
    { time: '2026-04-04 13:20 UTC', src: 'GEOINT/B1', text: 'Bulk carrier ETERNITY C confirmed sunk in Red Sea vicinity of Hodeidah (July 2025 attack)' },
    { time: '2026-04-04 12:00 UTC', src: 'OSINT/A2', text: 'Iran retaliatory strikes hit 27 US bases across 9 countries — largest coordinated response since 1979' },
    { time: '2026-04-04 10:45 UTC', src: 'AIS/A1', text: 'MSC, Maersk, COSCO, ONE, HMM — all confirm global Middle East booking suspension' },
    { time: '2026-04-04 09:30 UTC', src: 'GEOINT/A2', text: 'Jebel Ali Port resumes ops after interceptor debris fire — DP World restores 4 terminals' },
  ];

  let idx = 0;
  let container = null;

  function typeMessage(msg) {
    const el = document.createElement('div');
    el.className = 'ticker-msg';
    el.innerHTML = `<span class="ticker-ts">[${msg.time}]</span> <span class="ticker-src">[${msg.src}]</span> <span class="ticker-body"></span>`;
    container.prepend(el);

    const body = el.querySelector('.ticker-body');
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx < msg.text.length) {
        body.textContent += msg.text[charIdx];
        charIdx++;
      } else {
        clearInterval(interval);
      }
    }, 18);

    // Keep only last 6
    while (container.children.length > 6) {
      container.lastChild.classList.add('fade-out');
      setTimeout(() => { if (container.lastChild) container.lastChild.remove(); }, 500);
    }
  }

  function start() {
    container = document.getElementById('ticker-track');
    if (!container) return;

    // Initial burst
    typeMessage(messages[0]);
    idx = 1;

    setInterval(() => {
      typeMessage(messages[idx % messages.length]);
      idx++;
    }, 5000);
  }

  return { start };
})();
