// ═══════════════════════════════════════════════
//  CHARTS
// ═══════════════════════════════════════════════
function renderCharts(a) {
  if (State.activeTab === 'overview') {
    renderVolumeOverview(a);
  } else if (State.activeTab === 'emotions') {
    renderEmotionDonut(a);
    renderEmotionTimelineChart(a);
  } else if (State.activeTab === 'voice') {
    renderWPMChart(a);
    renderPitchChart(a);
    renderVolumeChartMain(a);
  } else if (State.activeTab === 'patterns') {
    renderFillerChart(a);
  }
}

var CHART_DEFAULTS = {
  plugins: { legend: { display: false } },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#4A5270', font: { family: 'JetBrains Mono', size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#4A5270', font: { family: 'JetBrains Mono', size: 10 } } }
  }
};

function renderVolumeOverview(a) {
  const el = document.getElementById('overview-volume-chart');
  if (!el) return;
  const data = a.volumeData || [];
  const ctx = el.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(0,212,255,.4)');
  gradient.addColorStop(1, 'rgba(0,212,255,.01)');
  State.charts.overviewVolume = new Chart(el, {
    type: 'line',
    data: {
      labels: data.map(d => formatTime(d.time)),
      datasets: [{ data: data.map(d => d.db + 60), fill: true, backgroundColor: gradient, borderColor: '#00D4FF', borderWidth: 2, pointRadius: 0, tension: 0.4 }]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: { display: false } }, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0, title: { display: true, text: 'Volume', color: '#4A5270', font: { size: 10 } } } } }
  });
}

function renderEmotionDonut(a) {
  const el = document.getElementById('emotion-donut');
  if (!el) return;
  const emotions = (a.emotions || []).filter(e => e.percentage > 0);
  const colors = { 'Confident':'#00D4FF','Happy':'#00E599','Neutral':'#8892A8','Anxious':'#F59E0B','Sad':'#8B5CF6','Angry':'#F43F5E','Surprised':'#FF8C42' };
  State.charts.emotionDonut = new Chart(el, {
    type: 'doughnut',
    data: {
      labels: emotions.map(e => e.emotion),
      datasets: [{ data: emotions.map(e => e.percentage), backgroundColor: emotions.map(e => colors[e.emotion] || '#888'), borderWidth: 2, borderColor: '#111420' }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: { legend: { display: false } }
    }
  });
}

function renderEmotionTimelineChart(a) {
  const el = document.getElementById('emotion-timeline-chart');
  if (!el) return;
  const timeline = a.emotionTimeline || [];
  const colors = { 'Confident':'#00D4FF','Happy':'#00E599','Neutral':'#8892A8','Anxious':'#F59E0B','Sad':'#8B5CF6','Angry':'#F43F5E','Surprised':'#FF8C42' };
  const emotionToNum = { 'Confident':6,'Happy':5,'Neutral':4,'Surprised':3,'Anxious':2,'Sad':1,'Angry':0 };
  State.charts.emotionTimeline = new Chart(el, {
    type: 'scatter',
    data: {
      datasets: [{
        data: timeline.map(t => ({ x: t.time, y: emotionToNum[t.emotion] ?? 4 })),
        backgroundColor: timeline.map(t => colors[t.emotion] || '#888'),
        pointRadius: 6, pointHoverRadius: 8
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: { legend: { display: false } },
      scales: {
        x: { ...CHART_DEFAULTS.scales.x, title: { display: true, text: 'Time (s)', color: '#4A5270', font: { size: 10 } } },
        y: { ...CHART_DEFAULTS.scales.y, min: -0.5, max: 6.5, ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: v => Object.entries(emotionToNum).find(([,n]) => n===Math.round(v))?.[0] || '' } }
      }
    }
  });
}

function renderWPMChart(a) {
  const el = document.getElementById('wpm-chart');
  if (!el) return;
  const data = a.wpmData || [];
  const ctx = el.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(139,92,246,.3)');
  gradient.addColorStop(1, 'rgba(139,92,246,.01)');
  State.charts.wpm = new Chart(el, {
    type: 'line',
    data: {
      labels: data.map(d => formatTime(d.time)),
      datasets: [
        { data: data.map(d => d.wpm), fill: true, backgroundColor: gradient, borderColor: '#8B5CF6', borderWidth: 2, pointRadius: 0, tension: 0.4, label: 'WPM' },
        { data: data.map(() => 120), borderColor: 'rgba(0,229,153,.4)', borderWidth: 1, borderDash: [4,4], pointRadius: 0, label: 'Min Ideal' },
        { data: data.map(() => 160), borderColor: 'rgba(245,158,11,.4)', borderWidth: 1, borderDash: [4,4], pointRadius: 0, label: 'Max Ideal' }
      ]
    },
    options: { ...CHART_DEFAULTS, plugins: { legend: { display: false } } }
  });
}

function renderPitchChart(a) {
  const el = document.getElementById('pitch-chart');
  if (!el) return;
  const data = a.pitchData || [];
  const ctx = el.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(0,229,153,.25)');
  gradient.addColorStop(1, 'rgba(0,229,153,.01)');
  State.charts.pitch = new Chart(el, {
    type: 'line',
    data: {
      labels: data.map(d => formatTime(d.time)),
      datasets: [{ data: data.map(d => d.hz), fill: true, backgroundColor: gradient, borderColor: '#00E599', borderWidth: 2, pointRadius: 0, tension: 0.3 }]
    },
    options: { ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, title: { display: true, text: 'Hz', color: '#4A5270', font: { size: 10 } } } } }
  });
}

function renderVolumeChartMain(a) {
  const el = document.getElementById('volume-chart');
  if (!el) return;
  const data = a.volumeData || [];
  const ctx = el.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(255,140,66,.3)');
  gradient.addColorStop(1, 'rgba(255,140,66,.01)');
  State.charts.volume = new Chart(el, {
    type: 'bar',
    data: {
      labels: data.map(d => formatTime(d.time)),
      datasets: [{ data: data.map(d => d.db + 60), backgroundColor: gradient, borderColor: '#FF8C42', borderWidth: 0 }]
    },
    options: { ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0, title: { display: true, text: 'dB', color: '#4A5270', font: { size: 10 } } } } }
  });
}

function renderFillerChart(a) {
  const el = document.getElementById('filler-chart');
  if (!el) return;
  const fillers = a.fillerWords || [];
  if (!fillers.length) return;
  State.charts.filler = new Chart(el, {
    type: 'bar',
    data: {
      labels: fillers.map(f => `"${f.word}"`),
      datasets: [{ data: fillers.map(f => f.count), backgroundColor: 'rgba(245,158,11,.6)', borderColor: '#F59E0B', borderWidth: 2, borderRadius: 6 }]
    },
    options: {
      indexAxis: 'y',
      ...CHART_DEFAULTS,
      plugins: { legend: { display: false } },
      scales: {
        x: { ...CHART_DEFAULTS.scales.x, title: { display: true, text: 'Count', color: '#4A5270', font: { size: 10 } } },
        y: { ...CHART_DEFAULTS.scales.y, ticks: { ...CHART_DEFAULTS.scales.y.ticks, color: '#F59E0B' } }
      }
    }
  });
}
