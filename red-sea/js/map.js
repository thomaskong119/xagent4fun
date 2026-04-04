window.renderThreatMap = function renderThreatMap(attacks, lang = 'en') {
  if (!window.L) return;

  const map = L.map('map', {
    zoomControl: true,
    worldCopyJump: false,
    zoomSnap: 0.5
  }).setView([20, 45], 4);

  // CartoDB dark tiles for tactical look
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 10,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
  }).addTo(map);

  const statusColors = {
    closed: '#f43f5e',
    'high-risk': '#fb923c',
    normal: '#34d399'
  };

  // Chokepoints — large pulsing markers
  attacks.chokepoints.forEach((point) => {
    const color = statusColors[point.status] || statusColors.normal;
    
    // Outer pulse ring
    L.circleMarker([point.lat, point.lng], {
      radius: 22,
      color: color,
      weight: 1,
      fillColor: color,
      fillOpacity: 0.08,
      className: 'pulse-ring'
    }).addTo(map);

    // Inner solid dot
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: 10,
      color: '#fff',
      weight: 2,
      fillColor: color,
      fillOpacity: 0.9
    }).addTo(map);

    const statusText = point.status === 'closed' 
      ? (lang === 'zh' ? '🔴 封锁/关闭' : '🔴 Closed / Disrupted')
      : (lang === 'zh' ? '🟠 高风险' : '🟠 High Risk');

    marker.bindPopup(`
      <div style="min-width:180px">
        <strong style="font-size:14px;color:#22d3ee">${lang === 'zh' ? point.nameZh : point.name}</strong><br>
        <span style="display:inline-block;margin-top:6px;font-weight:600">${statusText}</span>
      </div>
    `);

    // Label
    L.marker([point.lat, point.lng], {
      icon: L.divIcon({
        className: 'chokepoint-label',
        html: `<div style="
          color:#fff;
          font-size:11px;
          font-weight:700;
          font-family:Inter,sans-serif;
          text-shadow:0 0 8px rgba(0,0,0,0.8),0 0 20px ${color};
          white-space:nowrap;
          pointer-events:none;
          transform:translateY(-28px);
        ">${lang === 'zh' ? point.nameZh : point.name}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      })
    }).addTo(map);
  });

  // Ports — small cyan dots
  attacks.ports.forEach((port) => {
    L.circleMarker([port.lat, port.lng], {
      radius: 4,
      color: '#22d3ee',
      weight: 1,
      fillColor: '#22d3ee',
      fillOpacity: 0.7
    })
      .addTo(map)
      .bindTooltip(lang === 'zh' ? port.nameZh : port.name, {
        direction: 'top',
        className: 'dark-tooltip',
        offset: [0, -8]
      });
  });

  // Attack events — diamond markers
  attacks.mapEvents.forEach((event) => {
    const color = statusColors[event.status] || statusColors.normal;
    
    L.circleMarker([event.lat, event.lng], {
      radius: 7,
      color: color,
      weight: 2,
      fillColor: color,
      fillOpacity: 0.5
    }).addTo(map).bindPopup(`
      <div style="min-width:200px">
        <strong style="color:#22d3ee">${lang === 'zh' ? event.nameZh : event.name}</strong><br>
        <span style="color:#7b8ba5;font-size:12px">${event.date}</span><br>
        <span style="display:inline-block;margin-top:4px;font-size:13px">${event.description}</span>
      </div>
    `);
  });

  // Normal Suez route — dashed gray
  L.polyline(attacks.routes.normal, {
    color: '#475569',
    weight: 2.5,
    opacity: 0.7,
    dashArray: '10, 8'
  }).addTo(map).bindPopup(
    `<strong style="color:#7b8ba5">${lang === 'zh' ? '❌ 正常经苏伊士航线（已中断）' : '❌ Standard Suez route (disrupted)'}</strong>`
  );

  // Cape reroute — glowing blue
  L.polyline(attacks.routes.cape, {
    color: '#38bdf8',
    weight: 3.5,
    opacity: 0.9
  }).addTo(map).bindPopup(
    `<strong style="color:#38bdf8">${lang === 'zh' ? '🔵 绕行好望角航线（+6000海里）' : '🔵 Cape of Good Hope reroute (+6,000 nm)'}</strong>`
  );

  // Shadow line for depth
  L.polyline(attacks.routes.cape, {
    color: '#38bdf8',
    weight: 8,
    opacity: 0.15
  }).addTo(map);

  setTimeout(() => map.invalidateSize(), 200);
  return map;
};
