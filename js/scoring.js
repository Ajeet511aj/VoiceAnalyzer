// ═══════════════════════════════════════════════
//  SCORING & RECOMMENDATIONS
// ═══════════════════════════════════════════════
function calculateOverallScore(data) {
  let score = 0;
  // WPM (25 pts)
  const wpm = data.wpmAverage || 0;
  if (wpm >= 120 && wpm <= 160) score += 25;
  else if (wpm >= 100 && wpm <= 180) score += 18;
  else if (wpm >= 80 && wpm <= 200) score += 10;
  else if (wpm > 0) score += 5;
  else score += 12; // no data, neutral
  // Fillers (25 pts)
  const totalFillers = (data.fillerWords || []).reduce((s, f) => s + f.count, 0);
  const wordCount = (data.words || []).length || 100;
  const fillerRate = totalFillers / wordCount;
  if (fillerRate < 0.02) score += 25;
  else if (fillerRate < 0.05) score += 18;
  else if (fillerRate < 0.10) score += 10;
  else score += 4;
  // Vocal variety (25 pts)
  const vv = data.vocalVarietyScore || 50;
  score += Math.round(vv * 0.25);
  // Emotion (25 pts)
  const posEms = ['Confident','Happy'];
  const posTotal = (data.emotions || []).filter(e => posEms.includes(e.emotion)).reduce((s, e) => s + e.percentage, 0);
  score += Math.round(posTotal * 0.25);
  return Math.min(100, Math.max(0, Math.round(score)));
}

function generateRecommendations(data) {
  const recs = [];
  const wpm = data.wpmAverage || 0;
  const totalFillers = (data.fillerWords || []).reduce((s, f) => s + f.count, 0);
  const wordCount = (data.words || []).length || 100;

  if (wpm > 180) {
    recs.push({ icon:'⚡', priority:'high', title:'Slow Down Your Pace',
      description:`Your average speed of ${wpm} WPM is above the ideal 120–160 WPM range. Rushing can cause listeners to miss key points.`,
      metric:`${wpm} WPM (ideal: 120–160 WPM)`,
      action:`Practice the "pause after every key point" technique. Breathe between ideas and resist filling silence.` });
  } else if (wpm > 0 && wpm < 100) {
    recs.push({ icon:'🐢', priority:'medium', title:'Increase Your Speaking Pace',
      description:`At ${wpm} WPM, your pace may feel slow and affect listener engagement.`,
      metric:`${wpm} WPM (ideal: 120–160 WPM)`,
      action:`Read aloud daily. Gradually increase speed while maintaining clarity and proper enunciation.` });
  }

  if (totalFillers > 10) {
    const top = data.fillerWords[0];
    recs.push({ icon:'🔇', priority:'high', title:'Reduce Filler Words',
      description:`You used ${totalFillers} filler words across ${wordCount} words. Your most frequent: "${top?.word}" used ${top?.count} times.`,
      metric:`${totalFillers} fillers (${Math.round(totalFillers/wordCount*100)}% of words)`,
      action:`Replace fillers with 1-second silent pauses. Record yourself in daily 2-minute drills and count fillers per minute.` });
  } else if (totalFillers > 5) {
    recs.push({ icon:'🔇', priority:'medium', title:'Minimize Filler Words',
      description:`You used ${totalFillers} filler words. Good, but there's room to eliminate these completely.`,
      metric:`${totalFillers} filler words`,
      action:`Practice mindful speaking. When you feel the urge to say "um", pause silently instead.` });
  }

  if (data.dominantEmotion === 'Anxious' || data.dominantEmotion === 'Angry') {
    recs.push({ icon:'🧘', priority:'high', title:'Work on Vocal Confidence',
      description:`Your voice showed signs of ${data.dominantEmotion.toLowerCase()} emotion. This can undermine your authority and listener trust.`,
      metric:`Dominant emotion: ${data.dominantEmotion}`,
      action:`Try 2-minute power poses before speaking. Practice deep diaphragmatic breathing to calm nerves before recording.` });
  }

  const vv = data.vocalVarietyScore || 0;
  if (vv < 40) {
    recs.push({ icon:'🎵', priority:'medium', title:'Add More Vocal Variety',
      description:`Your pitch variation score is ${vv}/100, suggesting a somewhat monotone delivery that may disengage listeners.`,
      metric:`Vocal variety: ${vv}/100`,
      action:`Practice reading passages with deliberate emphasis. Raise pitch on key words, lower it on conclusions.` });
  }

  const pauses = data.pauses || [];
  if (pauses.length === 0 && wpm > 140) {
    recs.push({ icon:'⏸️', priority:'low', title:'Use Strategic Pauses',
      description:`No significant pauses were detected. Strategic pausing creates emphasis and lets ideas land.`,
      metric:`0 pauses detected (2+ seconds)`,
      action:`Insert 2–3 second pauses before key points. Treat pauses as punctuation, not silence to fill.` });
  }

  if (data.overallScore >= 75) {
    recs.push({ icon:'⭐', priority:'low', title:'Excellent Overall Performance',
      description:`Your voice analysis shows strong communication skills across the board. Keep up the great work!`,
      metric:`Overall score: ${data.overallScore}/100`,
      action:`Challenge yourself with longer or more complex topics. Focus on maintaining consistency across different contexts.` });
  }

  return recs.slice(0, 5);
}
