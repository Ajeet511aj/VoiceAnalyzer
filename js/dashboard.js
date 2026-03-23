// ═══════════════════════════════════════════════
//  DASHBOARD VIEW
// ═══════════════════════════════════════════════
function renderDashboard() {
  const name = State.profile?.full_name || State.user?.user_metadata?.full_name || 'there';
  const firstName = name.split(' ')[0];
  return `
  ${renderNav()}
  <div class="page fade-in">
    <div style="margin-bottom:32px">
      <h1 class="t-lg" style="margin-bottom:6px">Hey, ${firstName} 👋</h1>
      <p class="muted">Analyze your voice and get AI-powered coaching insights</p>
    </div>

    <div class="grid-2" style="margin-bottom:32px">
      <!-- RECORD -->
      <div class="card card-glow" style="display:flex;flex-direction:column;align-items:center;gap:20px;padding:32px 24px">
        <div style="text-align:center">
          <div style="font-size:1rem;font-weight:700;margin-bottom:4px">Record Voice</div>
          <div class="muted" style="font-size:.85rem">Speak directly into your browser</div>
        </div>
        <div class="mic-container">
          <div style="position:relative">
            <button id="mic-btn" class="mic-btn idle" onclick="toggleRecording()">🎙️</button>
          </div>
          <canvas id="waveform" class="waveform-canvas hidden" width="300" height="80"></canvas>
          <div id="rec-timer" class="recording-timer hidden">00:00</div>
          <div id="volume-indicator" class="volume-bar-container hidden">
            <div id="volume-fill" class="volume-fill"></div>
          </div>
          <div id="rec-controls" class="hidden flex gap-3">
            <button class="btn btn-ghost btn-sm" onclick="pauseRecording()" id="btn-pause">⏸ Pause</button>
            <button class="btn btn-ghost btn-sm" onclick="resetRecording()" id="btn-reset">🔄 Reset</button>
            <button class="btn btn-danger btn-sm" onclick="stopAndAnalyze()">⏹ Stop & Analyze</button>
          </div>
          <div id="rec-status" class="muted t-xs">Click to start recording</div>
        </div>
      </div>

      <!-- UPLOAD -->
      <div class="card" style="display:flex;flex-direction:column;gap:16px">
        <div>
          <div style="font-size:1rem;font-weight:700;margin-bottom:4px">Upload Audio</div>
          <div class="muted" style="font-size:.85rem">MP3, WAV, M4A, OGG, FLAC, WebM (max 50MB)</div>
        </div>
        <div id="drop-zone" class="upload-zone" onclick="document.getElementById('file-input').click()">
          <div class="upload-icon">📁</div>
          <div style="font-weight:600;margin-bottom:6px">Drop your audio file here</div>
          <div class="muted" style="font-size:.83rem">or click to browse files</div>
          <input id="file-input" type="file" accept="audio/*" style="display:none" onchange="handleFileSelect(event)"/>
        </div>
        <div id="upload-file-info" class="hidden">
          <div class="panel flex items-center gap-3">
            <div style="font-size:1.4rem">🎵</div>
            <div style="flex:1;overflow:hidden">
              <div id="upload-fname" style="font-weight:600;font-size:.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>
              <div id="upload-fsize" class="muted t-xs"></div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="clearUpload()">✕</button>
          </div>
          <button class="btn btn-primary w-full" style="margin-top:10px" onclick="analyzeUploadedFile()">
            🔍 Analyze This Recording
          </button>
        </div>
      </div>
    </div>

    <!-- QUICK STATS -->
    <div id="dash-stats" class="hidden">
      <div class="section-header">
        <div class="section-title">📊 Your Stats</div>
        <button class="btn btn-ghost btn-sm" onclick="navigate('history')">View History →</button>
      </div>
      <div class="grid-3" id="stats-grid"></div>
    </div>

    <!-- TIPS -->
    <div class="card" style="margin-top:24px;background:linear-gradient(135deg,var(--cyan-dim),var(--purple-dim))">
      <div style="font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px">
        <span>💡</span> Quick Tips for Better Analysis
      </div>
      <div class="grid-3" style="gap:12px">
        <div class="panel"><div style="font-size:.88rem;font-weight:600;margin-bottom:4px">🎙️ Microphone Position</div><div class="muted" style="font-size:.8rem">Keep mic 20-30cm from mouth for clearest capture</div></div>
        <div class="panel"><div style="font-size:.88rem;font-weight:600;margin-bottom:4px">🤫 Quiet Environment</div><div class="muted" style="font-size:.8rem">Record in a quiet room for best accuracy</div></div>
        <div class="panel"><div style="font-size:.88rem;font-weight:600;margin-bottom:4px">⏱️ Ideal Length</div><div class="muted" style="font-size:.8rem">30 seconds to 5 minutes for best insights</div></div>
      </div>
    </div>
  </div>`;
}

function renderNav() {
  const name = State.profile?.full_name || State.user?.user_metadata?.full_name || 'User';
  const initial = name[0].toUpperCase();
  return `
  <nav class="topnav">
    <div class="logo" onclick="navigate('dashboard')" style="cursor:pointer">
      <div class="logo-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" fill="white"/></svg></div>
      <span class="logo-text">VoxIQ</span>
    </div>
    <div class="nav-links">
      <a class="nav-link ${State.view==='dashboard'?'active':''}" onclick="navigate('dashboard')">Dashboard</a>
      <a class="nav-link ${State.view==='history'?'active':''}" onclick="navigate('history')">History</a>
      <div class="avatar" onclick="showProfileMenu()" title="${name}">${initial}</div>
    </div>
  </nav>`;
}

function showProfileMenu() {
  const existing = document.getElementById('profile-menu');
  if (existing) { existing.remove(); return; }
  const m = document.createElement('div');
  m.id = 'profile-menu';
  m.style.cssText = 'position:fixed;top:68px;right:24px;background:var(--card2);border:1px solid var(--border2);border-radius:12px;padding:8px;z-index:999;min-width:200px;box-shadow:0 10px 40px rgba(0,0,0,.5)';
  const name = State.profile?.full_name || State.user?.user_metadata?.full_name || 'User';
  const email = State.user?.email || '';
  m.innerHTML = `
    <div style="padding:10px 12px;border-bottom:1px solid var(--border);margin-bottom:6px">
      <div style="font-weight:700;font-size:.9rem">${name}</div>
      <div class="muted" style="font-size:.78rem">${email}</div>
    </div>
    <button class="btn btn-ghost btn-sm w-full" style="justify-content:flex-start;margin-bottom:4px" onclick="navigate('history');document.getElementById('profile-menu')?.remove()">📋 Analysis History</button>
    <button class="btn btn-danger btn-sm w-full" style="justify-content:flex-start" onclick="logout();document.getElementById('profile-menu')?.remove()">🚪 Sign Out</button>
  `;
  document.body.appendChild(m);
  setTimeout(() => document.addEventListener('click', () => m.remove(), { once: true }), 10);
}

function bindDashboard() {
  const dz = document.getElementById('drop-zone');
  if (dz) {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragging'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragging'));
    dz.addEventListener('drop', e => {
      e.preventDefault(); dz.classList.remove('dragging');
      const f = e.dataTransfer.files[0];
      if (f) processSelectedFile(f);
    });
  }
  loadDashStats();
}

async function loadDashStats() {
  if (!supabaseClient || !State.user) return;
  const { data } = await supabaseClient.from('analyses').select('overall_score,wpm_average,created_at').eq('user_id', State.user.id).eq('status', 'completed').order('created_at', { ascending: false }).limit(10);
  if (!data || !data.length) return;
  const avg = arr => arr.reduce((s, v) => s + v, 0) / arr.length;
  const scores = data.map(d => d.overall_score).filter(Boolean);
  const wpms = data.map(d => d.wpm_average).filter(Boolean);
  const grid = document.getElementById('stats-grid');
  const statsDiv = document.getElementById('dash-stats');
  if (!grid || !statsDiv) return;
  statsDiv.classList.remove('hidden');
  grid.innerHTML = `
    <div class="stat-card"><div class="stat-val">${data.length}</div><div class="stat-lbl">Analyses Done</div></div>
    <div class="stat-card"><div class="stat-val">${scores.length ? Math.round(avg(scores)) : '--'}</div><div class="stat-lbl">Avg Score</div></div>
    <div class="stat-card"><div class="stat-val">${wpms.length ? Math.round(avg(wpms)) : '--'}</div><div class="stat-lbl">Avg WPM</div></div>
  `;
}
