// ═══════════════════════════════════════════════
//  AUDIO ANALYSIS
// ═══════════════════════════════════════════════
function calculateAverageWPM(words, durationSecs) {
  if (!words || !words.length || !durationSecs) return 0;
  return Math.round((words.length / durationSecs) * 60);
}

function calculateWPMTimeline(words, durationSecs) {
  if (!words || words.length < 2) return [];
  const data = [];
  const windowSec = 15;
  const stepSec = 3;
  for (let t = 0; t <= durationSecs; t += stepSec) {
    const wStart = Math.max(0, t - windowSec / 2) * 1000;
    const wEnd = Math.min(durationSecs, t + windowSec / 2) * 1000;
    const windowWords = words.filter(w => w.start >= wStart && w.end <= wEnd);
    const windowMins = (wEnd - wStart) / 1000 / 60;
    const wpm = windowMins > 0 ? Math.round(windowWords.length / windowMins) : 0;
    data.push({ time: parseFloat(t.toFixed(1)), wpm });
  }
  return data;
}

function detectFillerWords(words) {
  if (!words) return [];
  const counts = {};
  const timestamps = {};
  words.forEach(w => {
    const text = (w.text || '').toLowerCase().replace(/[^a-z]/g, '');
    CONFIG.FILLERS.forEach(f => {
      if (text === f) {
        counts[f] = (counts[f] || 0) + 1;
        if (!timestamps[f]) timestamps[f] = [];
        timestamps[f].push(w.start / 1000);
      }
    });
  });
  return Object.entries(counts)
    .map(([word, count]) => ({ word, count, timestamps: timestamps[word] || [] }))
    .sort((a, b) => b.count - a.count);
}

function detectPauses(words, durationSecs) {
  if (!words || words.length < 2) return [];
  const pauses = [];
  for (let i = 1; i < words.length; i++) {
    const gap = (words[i].start - words[i-1].end) / 1000;
    if (gap >= 2) {
      pauses.push({
        start: parseFloat((words[i-1].end / 1000).toFixed(1)),
        end: parseFloat((words[i].start / 1000).toFixed(1)),
        duration: parseFloat(gap.toFixed(1))
      });
    }
  }
  return pauses;
}

function analyzePitch(audioBuffer) {
  const pitchData = [];
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);
  const chunkSize = Math.floor(sampleRate * 0.5);
  for (let i = 0; i < channelData.length; i += chunkSize) {
    const chunk = channelData.slice(i, i + chunkSize);
    const pitch = autocorrelate(chunk, sampleRate);
    const time = parseFloat((i / sampleRate).toFixed(2));
    if (pitch > 50 && pitch < 500) pitchData.push({ time, hz: Math.round(pitch) });
    else if (pitchData.length > 0) pitchData.push({ time, hz: null });
  }
  return pitchData.filter(d => d.hz !== null);
}

function autocorrelate(buffer, sampleRate) {
  const SIZE = buffer.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;
  const c = new Float32Array(SIZE);
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE - i; j++) c[i] += buffer[j] * buffer[j + i];
  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  if (maxpos < 1) return -1;
  const x1 = c[maxpos-1], x2 = c[maxpos], x3 = maxpos + 1 < SIZE ? c[maxpos + 1] : c[maxpos];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  let T0 = maxpos;
  if (a) T0 -= b / (2 * a);
  return sampleRate / T0;
}

function analyzeVolume(audioBuffer) {
  const volumeData = [];
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);
  const chunkSize = Math.floor(sampleRate * 0.5);
  for (let i = 0; i < channelData.length; i += chunkSize) {
    const chunk = channelData.slice(i, i + chunkSize);
    let rms = 0;
    for (let j = 0; j < chunk.length; j++) rms += chunk[j] * chunk[j];
    rms = Math.sqrt(rms / chunk.length);
    const db = rms > 0 ? 20 * Math.log10(rms) : -60;
    const time = parseFloat((i / sampleRate).toFixed(2));
    volumeData.push({ time, db: parseFloat(Math.max(-60, db).toFixed(1)) });
  }
  return volumeData;
}

function calculateVocalVariety(pitchData) {
  if (!pitchData || pitchData.length < 3) return 50;
  const pitches = pitchData.map(d => d.hz);
  const min = Math.min(...pitches), max = Math.max(...pitches);
  const range = max - min;
  const avg = pitches.reduce((s,v) => s+v, 0) / pitches.length;
  const cv = range / avg; // coefficient of variation
  return Math.min(100, Math.round(cv * 200));
}

function generateFallbackPitch(duration) {
  const data = [];
  const base = 120 + Math.random() * 60;
  for (let t = 0; t < duration; t += 0.5) {
    data.push({ time: parseFloat(t.toFixed(1)), hz: Math.round(base + (Math.random() - 0.5) * 40) });
  }
  return data;
}

function generateFallbackVolume(duration) {
  const data = [];
  for (let t = 0; t < duration; t += 0.5) {
    data.push({ time: parseFloat(t.toFixed(1)), db: parseFloat((-20 + (Math.random() - 0.5) * 15).toFixed(1)) });
  }
  return data;
}
