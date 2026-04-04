window.renderThreatMap = function renderThreatMap(attacks, lang = 'en') {
  if (!window.L) return;

  const map = L.map('map', {
    zoomControl: true,
    worldCopyJump: false
  }).setView([22.5, 42], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 8,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const statusColors = {
    closed: '#ff5b6e',
    'high-risk': '#ff9f43',
    normal: '#1dd1a1'
  };

  const makeIcon = (color) =>
    L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 18px ${color}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

  attacks.chokepoints.forEach((point) => {
    const marker = L.marker([point.lat, point.lng], {
      icon: makeIcon(statusColors[point.status] || statusColors.normal)
    }).addTo(map);

    marker.bindPopup(`
      <strong>${lang === 'zh' ? point.nameZh : point.name}</strong><br>
      ${point.status === 'closed' ? (lang === 'zh' ? '封锁/关闭' : 'Closed / Disrupted') : (lang === 'zh' ? '高风险' : 'High Risk')}
    `);
  });

  attacks.ports.forEach((port) => {
    L.circleMarker([port.lat, port.lng], {
      radius: 5,
      color: '#4dd7ff',
      weight: 1,
      fillColor: '#4dd7ff',
      fillOpacity: 0.8
    })
      .addTo(map)
      .bindTooltip(lang === 'zh' ? port.nameZh : port.name, { direction: 'top' });
  });

  attacks.mapEvents.forEach((event) => {
    const marker = L.circleMarker([event.lat, event.lng], {
      radius: 8,
      color: statusColors[event.status] || statusColors.normal,
      weight: 2,
      fillColor: statusColors[event.status] || statusColors.normal,
      fillOpacity: 0.6
    }).addTo(map);

    marker.bindPopup(`
      <strong>${lang === 'zh' ? event.nameZh : event.name}</strong><br>
      <span>${event.date}</span><br>
      <span>${event.description}</span>
    `);
  });

  L.polyline(attacks.routes.normal, {
    color: '#8a94a6',
    weight: 3,
    opacity: 0.9,
    dashArray: '8, 8'
  })
    .addTo(map)
    .bindPopup(lang === 'zh' ? '正常经苏伊士航线' : 'Standard Suez route');

  L.polyline(attacks.routes.cape, {
    color: '#1e90ff',
    weight: 4,
    opacity: 0.95
  })
    .addTo(map)
    .bindPopup(lang === 'zh' ? '绕行好望角航线' : 'Cape of Good Hope reroute');

  setTimeout(() => map.invalidateSize(), 100);
  return map;
};
