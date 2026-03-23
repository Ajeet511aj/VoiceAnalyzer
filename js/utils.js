// ═══════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════
function toast(msg, type='info', duration=4000) {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  const icons = {info:'ℹ️',success:'✅',error:'❌'};
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'slide-out .3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, duration);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function getEmotionEmoji(emotion) {
  const map = { 'Confident':'💪','Happy':'😊','Neutral':'😐','Anxious':'😰','Sad':'😔','Angry':'😠','Surprised':'😲' };
  return map[emotion] || '😐';
}

function getEmotionInterpretation(emotion) {
  const map = {
    'Confident': 'You sounded assured and authoritative. This projects credibility and leadership.',
    'Happy': 'Your voice carried positive energy and warmth, making you engaging to listen to.',
    'Neutral': 'Your tone was balanced and calm. Great for informative content.',
    'Anxious': 'Your voice showed some nervousness. Work on breathing exercises to project calm.',
    'Sad': 'Your voice carried a subdued tone. Consider more vocal variety to engage listeners.',
    'Angry': 'Your voice showed intensity. Channel this energy positively for persuasive speaking.',
    'Surprised': 'Your voice showed reactivity and spontaneity, which keeps listeners engaged.',
  };
  return map[emotion] || 'Your emotional tone was detected by AI analysis.';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
