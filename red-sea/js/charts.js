window.renderCharts = function renderCharts(stats, lang = 'en') {
  if (!window.Chart) return;

  const axisColor = '#7b8ba5';
  const gridColor = 'rgba(56, 189, 248, 0.06)';
  const fontFamily = "'Inter', sans-serif";

  Chart.defaults.font.family = fontFamily;

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        labels: { color: '#e2e8f0', font: { weight: 600 }, padding: 16 }
      },
      tooltip: {
        backgroundColor: 'rgba(12, 18, 34, 0.95)',
        borderColor: 'rgba(56, 189, 248, 0.2)',
        borderWidth: 1,
        titleColor: '#22d3ee',
        bodyColor: '#e2e8f0',
        cornerRadius: 10,
        padding: 12,
        titleFont: { weight: 700 }
      }
    },
    scales: {
      x: {
        ticks: { color: axisColor, font: { size: 11, weight: 500 } },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: axisColor, font: { size: 11, weight: 500 } },
        grid: { color: gridColor }
      }
    }
  };

  const suezCanvas = document.getElementById('suez-chart');
  const freightCanvas = document.getElementById('freight-chart');

  if (window.__suezChart) window.__suezChart.destroy();
  if (window.__freightChart) window.__freightChart.destroy();

  // Suez Transit Collapse — gradient bars
  window.__suezChart = new Chart(suezCanvas, {
    type: 'bar',
    data: {
      labels: stats.suezTransitSeries.labels,
      datasets: [{
        label: lang === 'zh' ? '通行量' : 'Transit Count',
        data: stats.suezTransitSeries.values,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          const colors = [
            ['#22d3ee', '#0ea5e9'],
            ['#38bdf8', '#3b82f6'],
            ['#fb923c', '#f97316'],
            ['#f43f5e', '#e11d48']
          ];
          const [c1, c2] = colors[ctx.dataIndex] || colors[0];
          gradient.addColorStop(0, c1);
          gradient.addColorStop(1, c2);
          return gradient;
        },
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.65
      }]
    },
    options: {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: { display: false }
      }
    }
  });

  // Freight Risk Index — glowing line
  window.__freightChart = new Chart(freightCanvas, {
    type: 'line',
    data: {
      labels: stats.freightIndex.labels,
      datasets: [{
        label: lang === 'zh' ? '风险指数' : 'Risk Index',
        data: stats.freightIndex.values,
        borderColor: '#f43f5e',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
          gradient.addColorStop(1, 'rgba(244, 63, 94, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#fb923c',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9
      }]
    },
    options: baseOptions
  });
};
