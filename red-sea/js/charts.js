window.renderCharts = function renderCharts(stats, lang = 'en') {
  if (!window.Chart) return;

  const axisColor = '#93a4bd';
  const gridColor = 'rgba(147, 164, 189, 0.12)';

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#edf2f7' }
      }
    },
    scales: {
      x: {
        ticks: { color: axisColor },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: axisColor },
        grid: { color: gridColor }
      }
    }
  };

  const suezCanvas = document.getElementById('suez-chart');
  const freightCanvas = document.getElementById('freight-chart');

  if (window.__suezChart) window.__suezChart.destroy();
  if (window.__freightChart) window.__freightChart.destroy();

  window.__suezChart = new Chart(suezCanvas, {
    type: 'bar',
    data: {
      labels: stats.suezTransitSeries.labels,
      datasets: [
        {
          label: lang === 'zh' ? '通行量' : 'Transit Count',
          data: stats.suezTransitSeries.values,
          backgroundColor: ['#4dd7ff', '#2f86ff', '#ff9f43', '#ff5b6e'],
          borderRadius: 8
        }
      ]
    },
    options: {
      ...baseOptions,
      plugins: {
        ...baseOptions.plugins,
        legend: { display: false }
      }
    }
  });

  window.__freightChart = new Chart(freightCanvas, {
    type: 'line',
    data: {
      labels: stats.freightIndex.labels,
      datasets: [
        {
          label: lang === 'zh' ? '风险指数' : 'Risk Index',
          data: stats.freightIndex.values,
          borderColor: '#ff5b6e',
          backgroundColor: 'rgba(255, 91, 110, 0.18)',
          fill: true,
          tension: 0.32,
          pointBackgroundColor: '#ff9f43',
          pointBorderColor: '#fff',
          pointRadius: 5
        }
      ]
    },
    options: baseOptions
  });
};
