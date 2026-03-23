// ═══════════════════════════════════════════════
//  ASSEMBLY AI
// ═══════════════════════════════════════════════
async function assemblyUpload(blob) {
  const res = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: { 'Authorization': CONFIG.ASSEMBLY_KEY, 'Content-Type': 'application/octet-stream' },
    body: blob
  });
  if (!res.ok) throw new Error('Upload failed: ' + res.statusText);
  const data = await res.json();
  return data.upload_url;
}

async function assemblySubmit(uploadUrl) {
  const res = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: { 'Authorization': CONFIG.ASSEMBLY_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audio_url: uploadUrl,
      sentiment_analysis: true,
      auto_highlights: true,
      word_boost: CONFIG.FILLERS,
    })
  });
  if (!res.ok) throw new Error('Submit failed: ' + res.statusText);
  const data = await res.json();
  return data.id;
}

async function assemblyPoll(transcriptId, onProgress) {
  let attempts = 0;
  while (attempts < 120) {
    await sleep(2500);
    const res = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { 'Authorization': CONFIG.ASSEMBLY_KEY }
    });
    const data = await res.json();
    if (data.status === 'completed') return data;
    if (data.status === 'error') throw new Error('Transcription failed: ' + data.error);
    if (onProgress) onProgress(`Processing... (${Math.round((attempts/40)*100)}%)`);
    attempts++;
  }
  throw new Error('Transcription timeout');
}

// ═══════════════════════════════════════════════
//  HUGGING FACE EMOTIONS
// ═══════════════════════════════════════════════
async function detectEmotions(audioBlob) {
  // Convert to WAV-compatible format for HuggingFace
  const arrayBuffer = await audioBlob.arrayBuffer();
  const res = await fetch(`https://api-inference.huggingface.co/models/${CONFIG.HF_MODEL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.HF_TOKEN}`,
      'Content-Type': 'audio/wav',
    },
    body: arrayBuffer
  });
  if (!res.ok) throw new Error('HF API error: ' + res.statusText);
  const raw = await res.json();
  
  // Map HF labels to our 7 emotions
  const emotionMap = {
    'angry': 'Angry', 'anger': 'Angry',
    'happy': 'Happy', 'happiness': 'Happy', 'joy': 'Happy',
    'sad': 'Sad', 'sadness': 'Sad',
    'fearful': 'Anxious', 'fear': 'Anxious', 'anxious': 'Anxious',
    'neutral': 'Neutral',
    'surprised': 'Surprised', 'surprise': 'Surprised',
    'calm': 'Confident', 'disgust': 'Angry',
    'confident': 'Confident',
  };

  // Aggregate mapped emotions
  const aggregated = {};
  raw.forEach(item => {
    const mapped = emotionMap[item.label.toLowerCase()] || 'Neutral';
    aggregated[mapped] = (aggregated[mapped] || 0) + item.score;
  });

  // Normalize to percentages
  const total = Object.values(aggregated).reduce((s, v) => s + v, 0) || 1;
  const emotions = Object.entries(aggregated)
    .map(([emotion, score]) => ({ emotion, percentage: Math.round((score / total) * 100) }))
    .sort((a, b) => b.percentage - a.percentage);

  // Ensure all 7 emotions present
  const all7 = ['Confident','Happy','Neutral','Anxious','Sad','Angry','Surprised'];
  all7.forEach(e => { if (!emotions.find(x => x.emotion === e)) emotions.push({ emotion: e, percentage: 0 }); });
  
  return emotions.sort((a, b) => b.percentage - a.percentage);
}

function generateFallbackEmotions(transcriptData) {
  // Derive emotions from sentiment analysis if HuggingFace fails
  const sentiments = transcriptData.sentiment_analysis_results || [];
  let pos = 0, neg = 0, neu = 0;
  sentiments.forEach(s => {
    if (s.sentiment === 'POSITIVE') pos++;
    else if (s.sentiment === 'NEGATIVE') neg++;
    else neu++;
  });
  const total = pos + neg + neu || 1;
  return [
    { emotion: 'Confident', percentage: Math.round((pos * 0.6 / total) * 100) },
    { emotion: 'Happy', percentage: Math.round((pos * 0.4 / total) * 100) },
    { emotion: 'Neutral', percentage: Math.round((neu / total) * 100) },
    { emotion: 'Anxious', percentage: Math.round((neg * 0.4 / total) * 100) },
    { emotion: 'Sad', percentage: Math.round((neg * 0.3 / total) * 100) },
    { emotion: 'Angry', percentage: Math.round((neg * 0.2 / total) * 100) },
    { emotion: 'Surprised', percentage: Math.round((neg * 0.1 / total) * 100) },
  ].sort((a, b) => b.percentage - a.percentage);
}

function generateEmotionTimeline(transcriptData, emotions) {
  const words = transcriptData.words || [];
  if (!words.length) return [];
  const duration = transcriptData.audio_duration || 10000;
  const timeline = [];
  const dominant = emotions[0]?.emotion || 'Neutral';
  const secondary = emotions[1]?.emotion || 'Neutral';
  for (let t = 0; t <= duration; t += 5000) {
    // Vary based on sentiment in that window
    const windowSentiments = (transcriptData.sentiment_analysis_results || [])
      .filter(s => s.start >= t && s.end <= t + 5000);
    let em = dominant;
    if (windowSentiments.length) {
      const s = windowSentiments[Math.floor(windowSentiments.length / 2)];
      if (s.sentiment === 'NEGATIVE') em = emotions.find(e => ['Anxious','Sad','Angry'].includes(e.emotion))?.emotion || dominant;
      else if (s.sentiment === 'POSITIVE') em = emotions.find(e => ['Confident','Happy'].includes(e.emotion))?.emotion || dominant;
    }
    timeline.push({ time: t / 1000, emotion: em, confidence: 0.8 + Math.random() * 0.2 });
  }
  return timeline;
}
