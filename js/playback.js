// ═══════════════════════════════════════════════
//  AUDIO PLAYBACK
// ═══════════════════════════════════════════════
function togglePlayback() {
  if (!State.audioElement) return;
  const btn = document.getElementById('play-btn');
  if (State.audioElement.paused) {
    State.audioElement.play();
    if(btn) btn.textContent = '⏸';
  } else {
    State.audioElement.pause();
    if(btn) btn.textContent = '▶';
  }
}

function updateAudioProgress() {
  if (!State.audioElement) return;
  const pct = (State.audioElement.currentTime / State.audioElement.duration) * 100;
  const fill = document.getElementById('audio-progress-fill');
  const curr = document.getElementById('audio-current');
  if(fill) fill.style.width = pct + '%';
  if(curr) curr.textContent = formatTime(State.audioElement.currentTime);
}

function seekAudio(e) {
  if (!State.audioElement) return;
  const bar = document.getElementById('audio-progress-bar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  State.audioElement.currentTime = pct * State.audioElement.duration;
}

function seekAudioTo(time) {
  if (!State.audioElement) return;
  State.audioElement.currentTime = time;
  if (State.audioElement.paused) State.audioElement.play();
  const btn = document.getElementById('play-btn');
  if(btn) btn.textContent = '⏸';
}

function copyTranscript() {
  const a = State.currentAnalysis;
  if (!a?.transcript) return;
  navigator.clipboard.writeText(a.transcript).then(() => toast('Transcript copied!', 'success'));
}
