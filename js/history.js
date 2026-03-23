// ═══════════════════════════════════════════════
//  HISTORY VIEW
// ═══════════════════════════════════════════════
function renderHistory() {
  return `
  ${renderNav()}
  <div class="page fade-in">
    <div class="section-header" style="margin-bottom:24px">
      <h2 class="t-lg">Analysis History</h2>
      <button class="btn btn-primary btn-sm" onclick="navigate('dashboard')">+ New Analysis</button>
    </div>
    <div id="history-content">
      <div class="empty-state"><div class="spinner"></div><div>Loading history...</div></div>
    </div>
  </div>`;
}

async function loadHistory() {
  const container = document.getElementById('history-content');
  if (!supabaseClient || !State.user) {
    if(container) container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔒</div>
        <h3>Not signed in</h3>
        <button class="btn btn-primary" onclick="navigate('auth')">Sign In</button>
      </div>`;
    return;
  }
  const { data, error } = await supabaseClient.from('analyses').select('*').eq('user_id', State.user.id).order('created_at', { ascending: false });
  if (!container) return;
  if (error || !data || !data.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎙️</div>
        <h3>No analyses yet</h3>
        <p class="muted">Record or upload audio to see your analysis history here.</p>
        <button class="btn btn-primary" onclick="navigate('dashboard')">Start Your First Analysis</button>
      </div>`;
    return;
  }
  State.analyses = data;
  container.innerHTML = `
    <table class="history-table">
      <thead><tr><th>Score</th><th>Date</th><th>Duration</th><th>WPM</th><th>Emotion</th><th>Words</th><th>Action</th></tr></thead>
      <tbody>
        ${data.map(a => {
          const score = a.overall_score || 0;
          const scoreClass = score >= 75 ? 'score-high' : score >= 50 ? 'score-mid' : 'score-low';
          const d = new Date(a.created_at);
          const dur = a.duration ? `${Math.floor(a.duration/60)}:${Math.round(a.duration%60).toString().padStart(2,'0')}` : '--';
          const wordArr = Array.isArray(a.words) ? a.words : (typeof a.words === 'string' ? JSON.parse(a.words||'[]') : []);
          return `
          <tr class="history-row" onclick="viewHistoryItem('${a.id}')">
            <td><div class="score-pill ${scoreClass}">${score}</div></td>
            <td><div style="font-size:.88rem">${d.toLocaleDateString()}</div><div class="muted" style="font-size:.75rem">${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div></td>
            <td><span class="mono">${dur}</span></td>
            <td><span class="mono">${a.wpm_average || '--'}</span></td>
            <td><span class="badge badge-cyan">${a.dominant_emotion || 'N/A'}</span></td>
            <td>${wordArr.length || '--'}</td>
            <td><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();viewHistoryItem('${a.id}')">View →</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function viewHistoryItem(id) {
  const item = State.analyses.find(a => a.id === id);
  if (!item) return;
  // Map DB fields to analysis object format
  State.currentAnalysis = {
    id: item.id,
    transcript: item.transcript || '',
    words: (typeof item.words === 'string' ? JSON.parse(item.words || '[]') : item.words) || [],
    fillerWords: (typeof item.filler_words === 'string' ? JSON.parse(item.filler_words || '[]') : item.filler_words) || [],
    wpmAverage: item.wpm_average,
    wpmData: (typeof item.wpm_data === 'string' ? JSON.parse(item.wpm_data || '[]') : item.wpm_data) || [],
    pitchData: (typeof item.pitch_data === 'string' ? JSON.parse(item.pitch_data || '[]') : item.pitch_data) || [],
    volumeData: (typeof item.volume_data === 'string' ? JSON.parse(item.volume_data || '[]') : item.volume_data) || [],
    emotions: (typeof item.emotions === 'string' ? JSON.parse(item.emotions || '[]') : item.emotions) || [],
    emotionTimeline: (typeof item.emotion_timeline === 'string' ? JSON.parse(item.emotion_timeline || '[]') : item.emotion_timeline) || [],
    dominantEmotion: item.dominant_emotion,
    overall_Score: item.overall_score,
    overallScore: item.overall_score,
    vocalVarietyScore: item.vocal_variety_score,
    pauses: (typeof item.pauses === 'string' ? JSON.parse(item.pauses || '[]') : item.pauses) || [],
    recommendations: (typeof item.recommendations === 'string' ? JSON.parse(item.recommendations || '[]') : item.recommendations) || [],
    duration: item.duration,
  };
  State.audioURL = null; State.audioElement = null;
  navigate('results');
}

function bindHistory() {}
