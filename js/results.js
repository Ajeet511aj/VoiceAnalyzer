// ═══════════════════════════════════════════════
//  RESULTS VIEW
// ═══════════════════════════════════════════════
function renderResults() {
  const a = State.currentAnalysis;
  if (!a) return `<div class="page"><div class="empty-state"><div class="empty-icon">🔍</div><h3>No analysis data</h3><button class="btn btn-primary" onclick="navigate('dashboard')">Go back</button></div></div>`;

  const score = a.overallScore || 0;
  const scoreColor = score >= 75 ? '#00E599' : score >= 50 ? '#F59E0B' : '#F43F5E';
  const circumference = 2 * Math.PI * 65; // r=65
  const offset = circumference - (score / 100) * circumference;
  const mins = Math.floor((a.duration || 0) / 60);
  const secs = Math.round((a.duration || 0) % 60);
  const totalFillers = (a.fillerWords || []).reduce((s, f) => s + f.count, 0);

  return `
  ${renderNav()}
  <div class="page fade-in">
    <!-- HEADER -->
    <div class="flex items-center justify-between" style="margin-bottom:24px">
      <div>
        <h2 class="t-lg">Analysis Results</h2>
        <div class="muted t-xs" style="margin-top:4px">${new Date().toLocaleString()}</div>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-ghost btn-sm" onclick="navigate('dashboard')">+ New Analysis</button>
        <button class="btn btn-primary btn-sm" onclick="downloadReport()">⬇ Download Report</button>
      </div>
    </div>

    <!-- AUDIO PLAYER -->
    ${State.audioURL ? `
    <div class="audio-player" style="margin-bottom:24px">
      <button class="play-btn" id="play-btn" onclick="togglePlayback()">▶</button>
      <div class="flex-col" style="flex:1;gap:6px">
        <div class="audio-progress" id="audio-progress-bar" onclick="seekAudio(event)">
          <div class="audio-progress-fill" id="audio-progress-fill" style="width:0%"></div>
        </div>
        <div class="flex justify-between">
          <span class="audio-time" id="audio-current">0:00</span>
          <span class="audio-time">${mins}:${secs.toString().padStart(2,'0')}</span>
        </div>
      </div>
    </div>` : ''}

    <!-- OVERVIEW STRIP -->
    <div style="display:grid;grid-template-columns:auto 1fr;gap:24px;margin-bottom:24px;align-items:center">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
        <div class="score-ring">
          <svg viewBox="0 0 160 160">
            <circle class="score-ring-track" cx="80" cy="80" r="65"/>
            <circle class="score-ring-fill" cx="80" cy="80" r="65"
              style="stroke:${scoreColor};stroke-dashoffset:${offset}"
              stroke-dasharray="${circumference}"/>
          </svg>
          <div class="score-number">
            <div class="score-num">${score}</div>
            <div class="score-label">Score</div>
          </div>
        </div>
        <div class="badge ${score>=75?'badge-green':score>=50?'badge-amber':'badge-red'}" style="font-size:.78rem">
          ${score>=75?'🏆 Excellent':score>=50?'📈 Good':'💪 Needs Work'}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px">
        <div class="stat-card"><div class="stat-val">${a.wpmAverage || '--'}</div><div class="stat-lbl">Avg WPM</div></div>
        <div class="stat-card"><div class="stat-val">${mins}:${secs.toString().padStart(2,'0')}</div><div class="stat-lbl">Duration</div></div>
        <div class="stat-card"><div class="stat-val">${(a.words || []).length}</div><div class="stat-lbl">Words</div></div>
        <div class="stat-card"><div class="stat-val">${totalFillers}</div><div class="stat-lbl">Fillers</div></div>
        <div class="stat-card"><div class="stat-val">${a.vocalVarietyScore || '--'}</div><div class="stat-lbl">Vocal Variety</div></div>
        <div class="stat-card"><div class="stat-val" style="font-size:1rem;font-family:var(--font)">${a.dominantEmotion || 'N/A'}</div><div class="stat-lbl">Dominant Emotion</div></div>
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs" style="margin-bottom:20px;overflow-x:auto" id="result-tabs">
      ${['overview','transcript','emotions','voice','patterns','recommendations'].map((t,i) => `
        <button class="tab ${State.activeTab===t?'active':''}" onclick="switchTab('${t}')">${['🏠 Overview','📝 Transcript','😊 Emotions','🎵 Voice','🔍 Patterns','💡 Tips'][i]}</button>`).join('')}
    </div>

    <div id="tab-content-area">
      ${renderTabContent(a)}
    </div>
  </div>`;
}

function renderTabContent(a) {
  switch(State.activeTab) {
    case 'overview': return renderOverviewTab(a);
    case 'transcript': return renderTranscriptTab(a);
    case 'emotions': return renderEmotionsTab(a);
    case 'voice': return renderVoiceTab(a);
    case 'patterns': return renderPatternsTab(a);
    case 'recommendations': return renderRecommendationsTab(a);
    default: return renderOverviewTab(a);
  }
}

function renderOverviewTab(a) {
  const score = a.overallScore || 0;
  const wpm = a.wpmAverage || 0;
  const strengths = [];
  const improvements = [];
  if (wpm >= 120 && wpm <= 160) strengths.push('Speaking pace is in the ideal range');
  else if (wpm > 160) improvements.push(`Speaking pace is too fast (${wpm} WPM)`);
  else if (wpm > 0 && wpm < 100) improvements.push(`Speaking pace is too slow (${wpm} WPM)`);
  const totalFillers = (a.fillerWords || []).reduce((s, f) => s + f.count, 0);
  if (totalFillers < 5) strengths.push('Excellent control over filler words');
  else improvements.push(`Reduce filler word usage (${totalFillers} detected)`);
  const vv = a.vocalVarietyScore || 0;
  if (vv >= 60) strengths.push('Good vocal variety and expressiveness');
  else improvements.push('Add more pitch variation to engage listeners');
  if (['Confident','Happy'].includes(a.dominantEmotion)) strengths.push(`Positive emotional tone (${a.dominantEmotion})`);
  else improvements.push(`Work on vocal confidence (${a.dominantEmotion || 'Neutral'} detected)`);
  if ((a.pauses || []).length > 0) strengths.push('Good use of strategic pauses');

  return `
  <div class="slide-up">
    <div class="grid-2" style="margin-bottom:20px">
      <div class="card" style="background:var(--green-dim);border-color:rgba(0,229,153,.2)">
        <div style="font-weight:700;color:var(--green);margin-bottom:12px;display:flex;align-items:center;gap:8px">✅ Strengths</div>
        ${strengths.length ? strengths.slice(0,3).map(s => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:.88rem"><span style="color:var(--green);flex-shrink:0">•</span><span>${s}</span></div>`).join('') : '<div class="muted" style="font-size:.85rem">Keep practicing to build strengths!</div>'}
      </div>
      <div class="card" style="background:var(--amber-dim);border-color:rgba(245,158,11,.2)">
        <div style="font-weight:700;color:var(--amber);margin-bottom:12px;display:flex;align-items:center;gap:8px">⚠️ To Improve</div>
        ${improvements.length ? improvements.slice(0,3).map(s => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:.88rem"><span style="color:var(--amber);flex-shrink:0">•</span><span>${s}</span></div>`).join('') : '<div class="muted" style="font-size:.85rem">Great work — keep it up!</div>'}
      </div>
    </div>

    <div style="margin-bottom:20px">
      <div class="chart-title">🔊 Audio Waveform Overview</div>
      <div class="chart-wrap">
        <div class="chart-canvas-wrap"><canvas id="overview-volume-chart"></canvas></div>
      </div>
    </div>
  </div>`;
}

function renderTranscriptTab(a) {
  if (!a.transcript) return `<div class="empty-state"><div class="empty-icon">📝</div><h3>No transcript available</h3></div>`;
  
  const words = a.words || [];
  const fillerSet = new Set((a.fillerWords || []).map(f => f.word));
  
  // Group into sentences (by ~10 words or pause)
  const sentences = [];
  let current = { words: [], start: 0, end: 0 };
  words.forEach((w, i) => {
    if (current.words.length === 0) current.start = w.start;
    current.words.push(w);
    current.end = w.end;
    if (current.words.length >= 12 || i === words.length - 1) {
      sentences.push({ ...current });
      current = { words: [], start: 0, end: 0 };
    }
  });

  return `
  <div class="slide-up">
    <div class="flex items-center justify-between" style="margin-bottom:12px">
      <div class="section-title">📝 Full Transcript</div>
      <button class="btn btn-ghost btn-sm" onclick="copyTranscript()">📋 Copy</button>
    </div>
    <div class="transcript-viewer" id="transcript-viewer">
      ${sentences.map((seg, i) => {
        const ts = formatTime(seg.start / 1000);
        const text = seg.words.map(w => {
          const isFiller = fillerSet.has((w.text || '').toLowerCase().replace(/[^a-z]/g,''));
          return isFiller ? `<span class="filler-word">${w.text}</span>` : w.text;
        }).join(' ');
        return `
        <div class="transcript-segment" onclick="seekAudioTo(${seg.start / 1000})">
          <div class="transcript-ts">${ts}</div>
          <div class="transcript-text">${text}</div>
        </div>`;
      }).join('')}
    </div>
    <div style="margin-top:16px;padding:12px 16px;background:var(--amber-dim);border:1px solid rgba(245,158,11,.2);border-radius:10px;font-size:.83rem;color:var(--text2);display:flex;align-items:center;gap:10px">
      <span class="filler-word">example</span> Words highlighted in amber are filler words. Click any segment to jump to that point in audio.
    </div>
  </div>`;
}

function renderEmotionsTab(a) {
  const emotions = a.emotions || [];
  const colors = { 'Confident':'#00D4FF','Happy':'#00E599','Neutral':'#8892A8','Anxious':'#F59E0B','Sad':'#8B5CF6','Angry':'#F43F5E','Surprised':'#FF8C42' };
  
  return `
  <div class="slide-up">
    <div class="grid-2" style="margin-bottom:20px">
      <div class="chart-wrap">
        <div class="chart-title">😊 Emotion Breakdown</div>
        <div style="display:flex;align-items:center;gap:20px">
          <div class="emotion-donut-wrap"><canvas id="emotion-donut"></canvas></div>
          <div class="emotion-legend">
            ${emotions.map(e => `
            <div class="emotion-row">
              <div class="emotion-dot" style="background:${colors[e.emotion]||'#888'}"></div>
              <div class="emotion-name t-xs">${e.emotion}</div>
              <div class="emotion-bar-bg"><div class="emotion-bar" style="width:${e.percentage}%;background:${colors[e.emotion]||'#888'}"></div></div>
              <div class="emotion-pct">${e.percentage}%</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center">
        <div style="font-size:3rem">${getEmotionEmoji(a.dominantEmotion)}</div>
        <div>
          <div style="font-size:1.4rem;font-weight:800;margin-bottom:4px">${a.dominantEmotion || 'Neutral'}</div>
          <div class="muted" style="font-size:.85rem">Dominant Emotion</div>
        </div>
        <div style="font-size:.9rem;max-width:220px;color:var(--text2);line-height:1.6">
          ${getEmotionInterpretation(a.dominantEmotion)}
        </div>
      </div>
    </div>

    <div class="chart-wrap">
      <div class="chart-title">📈 Emotion Timeline</div>
      <div class="chart-canvas-wrap"><canvas id="emotion-timeline-chart"></canvas></div>
    </div>
  </div>`;
}

function renderVoiceTab(a) {
  const vv = a.vocalVarietyScore || 0;
  const vvLabel = vv >= 70 ? 'High Variety' : vv >= 40 ? 'Moderate Variety' : 'Low Variety';
  const vvColor = vv >= 70 ? '#00E599' : vv >= 40 ? '#F59E0B' : '#F43F5E';
  const circumference = Math.PI * 55; // half circle, r=55
  const vvOffset = circumference - (vv / 100) * circumference;
  const pauses = a.pauses || [];
  const totalPauseTime = pauses.reduce((s, p) => s + p.duration, 0);

  return `
  <div class="slide-up">
    <div class="grid-2" style="margin-bottom:20px">
      <div class="chart-wrap">
        <div class="chart-title">⚡ Speaking Speed (WPM)</div>
        <div class="chart-canvas-wrap"><canvas id="wpm-chart"></canvas></div>
        <div style="margin-top:12px;display:flex;gap:16px;font-size:.8rem">
          <div>Avg: <strong style="color:var(--cyan);font-family:var(--mono)">${a.wpmAverage} WPM</strong></div>
          <div>Ideal: <span style="color:var(--text2)">120–160 WPM</span></div>
        </div>
      </div>
      <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">
        <div class="chart-title" style="margin-bottom:0">🎯 Vocal Variety Score</div>
        <div style="position:relative;width:160px;height:90px;overflow:hidden">
          <svg width="160" height="90" viewBox="0 0 160 90">
            <path d="M 10 85 A 70 70 0 0 1 150 85" fill="none" stroke="var(--border)" stroke-width="14" stroke-linecap="round"/>
            <path d="M 10 85 A 70 70 0 0 1 150 85" fill="none" stroke="${vvColor}" stroke-width="14" stroke-linecap="round"
              stroke-dasharray="${circumference}" stroke-dashoffset="${vvOffset}"
              style="transition:stroke-dashoffset 1.5s ease"/>
          </svg>
          <div style="position:absolute;bottom:4px;left:50%;transform:translateX(-50%);text-align:center">
            <div style="font-size:1.6rem;font-weight:800;font-family:var(--mono);color:${vvColor}">${vv}</div>
          </div>
        </div>
        <div class="badge ${vv>=70?'badge-green':vv>=40?'badge-amber':'badge-red'}">${vvLabel}</div>
        <div class="muted" style="font-size:.8rem;text-align:center;max-width:200px">Measures pitch range variation. Higher = more engaging delivery</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:20px">
      <div class="chart-wrap">
        <div class="chart-title">🎶 Pitch (Hz) Over Time</div>
        <div class="chart-canvas-wrap"><canvas id="pitch-chart"></canvas></div>
      </div>
      <div class="chart-wrap">
        <div class="chart-title">📢 Volume (dB) Over Time</div>
        <div class="chart-canvas-wrap"><canvas id="volume-chart"></canvas></div>
      </div>
    </div>

    ${pauses.length ? `
    <div class="card">
      <div class="chart-title" style="margin-bottom:16px">⏸️ Detected Pauses (≥2 seconds)</div>
      <div style="display:flex;gap:20px;margin-bottom:16px;font-size:.85rem">
        <div>Total pauses: <strong style="color:var(--cyan)">${pauses.length}</strong></div>
        <div>Total pause time: <strong style="color:var(--cyan)">${totalPauseTime.toFixed(1)}s</strong></div>
      </div>
      <table class="pause-table">
        <thead><tr><th>#</th><th>Start</th><th>End</th><th>Duration</th></tr></thead>
        <tbody>
          ${pauses.slice(0,10).map((p, i) => `
          <tr>
            <td style="color:var(--text3)">${i+1}</td>
            <td>${formatTime(p.start)}</td>
            <td>${formatTime(p.end)}</td>
            <td class="pause-dur">${p.duration}s</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : `
    <div class="panel" style="text-align:center;color:var(--text2);font-size:.88rem">
      No significant pauses (≥2s) detected in this recording.
    </div>`}
  </div>`;
}

function renderPatternsTab(a) {
  const fillers = a.fillerWords || [];
  const totalFillers = fillers.reduce((s, f) => s + f.count, 0);
  const wordCount = (a.words || []).length;

  return `
  <div class="slide-up">
    <div class="section-header"><div class="section-title">🔇 Filler Word Analysis</div></div>
    ${fillers.length ? `
    <div class="panel" style="margin-bottom:20px;display:flex;gap:24px">
      <div><div class="stat-val">${totalFillers}</div><div class="stat-lbl">Total Fillers</div></div>
      <div><div class="stat-val">${wordCount > 0 ? (totalFillers/wordCount*100).toFixed(1) : '0'}%</div><div class="stat-lbl">Of All Words</div></div>
      <div><div class="stat-val">${fillers.length}</div><div class="stat-lbl">Types Used</div></div>
    </div>
    <div class="filler-grid" style="margin-bottom:24px">
      ${fillers.map(f => `
      <div class="filler-card">
        <div class="filler-word-big">"${f.word}"</div>
        <div class="filler-count">${f.count}</div>
        <div class="filler-times">${f.count === 1 ? 'time' : 'times'}</div>
      </div>`).join('')}
    </div>` : `
    <div class="panel" style="text-align:center;padding:32px;margin-bottom:20px">
      <div style="font-size:2rem;margin-bottom:8px">🎉</div>
      <div style="font-weight:700;margin-bottom:4px">No Filler Words Detected!</div>
      <div class="muted" style="font-size:.85rem">Excellent vocal discipline. Keep it up!</div>
    </div>`}

    <div class="chart-wrap">
      <div class="chart-title">📊 Filler Word Distribution</div>
      <div class="chart-canvas-wrap" style="height:160px"><canvas id="filler-chart"></canvas></div>
    </div>
  </div>`;
}

function renderRecommendationsTab(a) {
  const recs = a.recommendations || [];
  if (!recs.length) return `<div class="empty-state"><div class="empty-icon">💡</div><h3>No recommendations</h3></div>`;
  return `
  <div class="slide-up">
    <div class="section-header">
      <div class="section-title">💡 AI-Powered Recommendations</div>
      <div class="muted t-xs">${recs.length} personalized insights</div>
    </div>
    ${recs.map((r, i) => `
    <div class="rec-card fade-in" style="animation-delay:${i*0.1}s">
      <div class="rec-icon">${r.icon}</div>
      <div style="flex:1">
        <div class="rec-priority ${r.priority}">${r.priority.toUpperCase()} PRIORITY</div>
        <div class="rec-title">${r.title}</div>
        <div class="rec-desc">${r.description}</div>
        <div class="rec-metric">📊 ${r.metric}</div>
        <div class="rec-action">💡 ${r.action}</div>
      </div>
    </div>`).join('')}
  </div>`;
}

function bindResults() {
  const a = State.currentAnalysis;
  if (!a) return;

  // Setup audio player
  if (State.audioURL) {
    State.audioElement = new Audio(State.audioURL);
    State.audioElement.addEventListener('timeupdate', updateAudioProgress);
    State.audioElement.addEventListener('ended', () => {
      const btn = document.getElementById('play-btn');
      if(btn) btn.textContent = '▶';
    });
  }

  // Render charts after DOM is ready
  setTimeout(() => renderCharts(a), 100);
}

function switchTab(tab) {
  State.activeTab = tab;
  const a = State.currentAnalysis;
  const area = document.getElementById('tab-content-area');
  const tabs = document.querySelectorAll('.tab');
  const tabNames = ['overview','transcript','emotions','voice','patterns','recommendations'];
  tabs.forEach((t, i) => {
    t.classList.toggle('active', tabNames[i] === tab);
  });
  if (area) {
    area.innerHTML = renderTabContent(a);
    setTimeout(() => renderCharts(a), 100);
  }
}
