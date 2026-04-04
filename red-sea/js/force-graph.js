/* ── D3-less Force-Directed Graph (Canvas) ── */
window.ForceGraph = (function () {
  const nodes = [
    { id: 'houthis', label: 'Houthis', labelZh: '胡塞武装', color: '#f43f5e', x: 120, y: 80, vx: 0, vy: 0 },
    { id: 'iran', label: 'Iran', labelZh: '伊朗', color: '#fb923c', x: 300, y: 60, vx: 0, vy: 0 },
    { id: 'us', label: 'United States', labelZh: '美国', color: '#38bdf8', x: 350, y: 280, vx: 0, vy: 0 },
    { id: 'israel', label: 'Israel', labelZh: '以色列', color: '#a78bfa', x: 180, y: 320, vx: 0, vy: 0 },
    { id: 'europe', label: 'EU Navies', labelZh: '欧洲海军', color: '#34d399', x: 420, y: 180, vx: 0, vy: 0 },
    { id: 'qatar', label: 'Qatar (LNG)', labelZh: '卡塔尔', color: '#fbbf24', x: 440, y: 350, vx: 0, vy: 0 },
  ];

  const edges = [
    { from: 'iran', to: 'houthis', type: 'proxy', label: 'Proxy / Arms', strength: 4 },
    { from: 'us', to: 'iran', type: 'adversary', label: 'Strikes', strength: 5 },
    { from: 'israel', to: 'iran', type: 'adversary', label: 'Joint Strikes', strength: 5 },
    { from: 'us', to: 'israel', type: 'ally', label: 'Alliance', strength: 3 },
    { from: 'europe', to: 'us', type: 'ally', label: 'Naval Cooperation', strength: 2 },
    { from: 'houthis', to: 'us', type: 'adversary', label: 'Red Sea Attacks', strength: 3 },
    { from: 'iran', to: 'qatar', type: 'adversary', label: 'LNG Facility Strike', strength: 4 },
    { from: 'europe', to: 'houthis', type: 'adversary', label: 'Escort Ops', strength: 2 },
  ];

  const typeColors = {
    proxy: '#fb923c',
    adversary: '#f43f5e',
    ally: '#34d399'
  };

  let canvas, ctx, W, H;
  let dragging = null, dragOffX = 0, dragOffY = 0;
  let hoveredNode = null;
  let lang = 'en';
  let animFrame;

  function dist(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  function simulate() {
    const repulsion = 8000;
    const attraction = 0.004;
    const damping = 0.85;
    const centerX = W / 2, centerY = H / 2;

    // Repulsion between all node pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        let d = Math.max(dist(a, b), 30);
        let force = repulsion / (d * d);
        a.vx += (dx / d) * force;
        a.vy += (dy / d) * force;
        b.vx -= (dx / d) * force;
        b.vy -= (dy / d) * force;
      }
    }

    // Attraction along edges
    edges.forEach((e) => {
      const a = nodes.find((n) => n.id === e.from);
      const b = nodes.find((n) => n.id === e.to);
      if (!a || !b) return;
      let dx = b.x - a.x, dy = b.y - a.y;
      let d = dist(a, b);
      let force = d * attraction * (e.strength || 1);
      a.vx += (dx / d) * force;
      a.vy += (dy / d) * force;
      b.vx -= (dx / d) * force;
      b.vy -= (dy / d) * force;
    });

    // Gravity to center
    nodes.forEach((n) => {
      n.vx += (centerX - n.x) * 0.001;
      n.vy += (centerY - n.y) * 0.001;
    });

    // Apply velocity
    nodes.forEach((n) => {
      if (n === dragging) return;
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx;
      n.y += n.vy;
      // Keep in bounds
      n.x = Math.max(50, Math.min(W - 50, n.x));
      n.y = Math.max(40, Math.min(H - 40, n.y));
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw edges
    edges.forEach((e) => {
      const a = nodes.find((n) => n.id === e.from);
      const b = nodes.find((n) => n.id === e.to);
      if (!a || !b) return;
      const color = typeColors[e.type] || '#475569';

      // Glow
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = (e.strength || 1) * 0.8;
      ctx.globalAlpha = 0.15;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();

      // Line
      ctx.strokeStyle = color;
      ctx.lineWidth = (e.strength || 1) * 0.6;
      ctx.globalAlpha = 0.6;
      if (e.type === 'ally') ctx.setLineDash([6, 4]);
      else ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      // Edge label
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      ctx.fillStyle = '#7b8ba5';
      ctx.font = '500 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(e.label, mx, my - 4);
    });

    // Draw nodes
    nodes.forEach((n) => {
      const isHovered = hoveredNode === n;
      const radius = isHovered ? 28 : 22;

      // Outer glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.globalAlpha = isHovered ? 0.15 : 0.06;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = isHovered ? 30 : 15;
      ctx.fill();
      ctx.restore();

      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `${n.color}22`;
      ctx.fill();
      ctx.strokeStyle = n.color;
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      ctx.stroke();

      // Label
      const label = lang === 'zh' ? n.labelZh : n.label;
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `${isHovered ? '700' : '600'} 11px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, n.x, n.y);
    });
  }

  function loop() {
    simulate();
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  function findNode(mx, my) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (dist(nodes[i], { x: mx, y: my }) < 28) return nodes[i];
    }
    return null;
  }

  function init(l) {
    lang = l || 'en';
    canvas = document.getElementById('force-graph');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width - 40 || 500;
    H = canvas.height = 420;

    // Scatter initial positions around center
    nodes.forEach((n) => {
      n.x = W / 2 + (Math.random() - 0.5) * W * 0.6;
      n.y = H / 2 + (Math.random() - 0.5) * H * 0.6;
    });

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
      const r = canvas.getBoundingClientRect();
      const n = findNode(e.clientX - r.left, e.clientY - r.top);
      if (n) { dragging = n; dragOffX = n.x - (e.clientX - r.left); dragOffY = n.y - (e.clientY - r.top); }
    });
    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      hoveredNode = findNode(mx, my);
      canvas.style.cursor = hoveredNode ? 'grab' : 'default';
      if (dragging) { dragging.x = mx + dragOffX; dragging.y = my + dragOffY; dragging.vx = 0; dragging.vy = 0; }
    });
    canvas.addEventListener('mouseup', () => { dragging = null; });
    canvas.addEventListener('mouseleave', () => { dragging = null; hoveredNode = null; });

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      const r = canvas.getBoundingClientRect();
      const t = e.touches[0];
      const n = findNode(t.clientX - r.left, t.clientY - r.top);
      if (n) { dragging = n; dragOffX = n.x - (t.clientX - r.left); dragOffY = n.y - (t.clientY - r.top); e.preventDefault(); }
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      if (dragging) {
        const r = canvas.getBoundingClientRect();
        const t = e.touches[0];
        dragging.x = t.clientX - r.left + dragOffX;
        dragging.y = t.clientY - r.top + dragOffY;
        dragging.vx = 0; dragging.vy = 0;
        e.preventDefault();
      }
    }, { passive: false });
    canvas.addEventListener('touchend', () => { dragging = null; });

    if (animFrame) cancelAnimationFrame(animFrame);
    loop();
  }

  function setLang(l) { lang = l; }

  return { init, setLang };
})();
