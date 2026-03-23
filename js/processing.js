// ═══════════════════════════════════════════════
//  PROCESSING VIEW
// ═══════════════════════════════════════════════
function renderProcessing() {
  return `
  ${renderNav()}
  <div class="processing-screen fade-in">
    <div class="processing-icon">🔬</div>
    <div style="text-align:center">
      <h2 class="t-lg grad-text" style="margin-bottom:8px">Analyzing Your Voice</h2>
      <p class="muted">Our AI is working on your recording...</p>
    </div>
    <div class="stages" id="stages-list">
      ${['Uploading Audio','Transcribing Speech','Detecting Emotions','Analyzing Voice Patterns','Generating Insights'].map((s,i) => `
        <div class="stage-item ${i===0?'active':'pending'}" id="stage-${i}">
          <div class="stage-icon">${i===0?'↻':'○'}</div>
          <div>
            <div class="stage-label">${s}</div>
            <div class="stage-sub" id="stage-sub-${i}">Waiting...</div>
          </div>
        </div>`).join('')}
    </div>
    <div style="width:100%;max-width:440px">
      <div class="progress-bar" style="height:8px">
        <div class="progress-fill" id="main-progress" style="width:0%"></div>
      </div>
      <div style="text-align:center;margin-top:10px;font-family:var(--mono);font-size:.8rem;color:var(--text2)" id="progress-label">0%</div>
    </div>
  </div>`;
}

function setStage(idx, status, sub='') {
  const el = document.getElementById(`stage-${idx}`);
  const subEl = document.getElementById(`stage-sub-${idx}`);
  if (!el) return;
  el.className = `stage-item ${status}`;
  const icon = el.querySelector('.stage-icon');
  if (icon) icon.textContent = status==='active' ? '↻' : status==='done' ? '✓' : '○';
  if (subEl && sub) subEl.textContent = sub;
}

function setProgress(pct) {
  const bar = document.getElementById('main-progress');
  const label = document.getElementById('progress-label');
  if(bar) bar.style.width = pct + '%';
  if(label) label.textContent = Math.round(pct) + '%';
}

async function startProcessing() {
  if (!State.audioBlob) { navigate('dashboard'); return; }
  try {
    const result = await runAnalysisPipeline(State.audioBlob);
    State.currentAnalysis = result;
    // Save to Supabase
    if (supabaseClient && State.user) {
      const { data } = await supabaseClient.from('analyses').insert({
        user_id: State.user.id,
        title: `Analysis ${new Date().toLocaleDateString()}`,
        status: 'completed',
        duration: result.duration,
        transcript: result.transcript,
        words: result.words,
        filler_words: result.fillerWords,
        wpm_average: result.wpmAverage,
        wpm_data: result.wpmData,
        pitch_data: result.pitchData,
        volume_data: result.volumeData,
        emotions: result.emotions,
        emotion_timeline: result.emotionTimeline,
        dominant_emotion: result.dominantEmotion,
        overall_score: result.overallScore,
        vocal_variety_score: result.vocalVarietyScore,
        pauses: result.pauses,
        recommendations: result.recommendations,
        assembly_ai_id: result.assemblyAiId,
      }).select().single();
      if (data) State.currentAnalysis.id = data.id;
    }
    navigate('results');
  } catch(err) {
    console.error('Analysis error:', err);
    toast('Analysis failed: ' + (err.message || 'Unknown error'), 'error');
    navigate('dashboard');
  }
}

// ═══════════════════════════════════════════════
//  ANALYSIS PIPELINE
// ═══════════════════════════════════════════════
async function runAnalysisPipeline(audioBlob) {
  const result = {};

  // Stage 0: Upload to AssemblyAI
  setStage(0, 'active', 'Uploading audio file...');
  const uploadUrl = await assemblyUpload(audioBlob);
  setStage(0, 'done', 'Upload complete'); setProgress(20);

  // Stage 1: Transcribe
  setStage(1, 'active', 'Transcribing with AI...');
  const transcriptId = await assemblySubmit(uploadUrl);
  const transcriptData = await assemblyPoll(transcriptId, (msg) => {
    const sub = document.getElementById('stage-sub-1');
    if(sub) sub.textContent = msg;
  });
  setStage(1, 'done', `${transcriptData.words?.length || 0} words transcribed`); setProgress(50);
  result.assemblyAiId = transcriptId;
  result.transcript = transcriptData.text || '';
  result.words = transcriptData.words || [];
  result.duration = transcriptData.audio_duration || 0;
  result.wpmAverage = calculateAverageWPM(transcriptData.words, transcriptData.audio_duration);
  result.wpmData = calculateWPMTimeline(transcriptData.words, transcriptData.audio_duration);
  result.fillerWords = detectFillerWords(transcriptData.words);
  result.pauses = detectPauses(transcriptData.words, transcriptData.audio_duration);

  // Stage 2: Emotions
  setStage(2, 'active', 'Analyzing emotional tone...');
  try {
    const emotions = await detectEmotions(audioBlob);
    result.emotions = emotions;
    result.dominantEmotion = emotions[0]?.emotion || 'Neutral';
    result.emotionTimeline = generateEmotionTimeline(transcriptData, emotions);
  } catch(e) {
    console.warn('HuggingFace emotion detection failed:', e);
    result.emotions = generateFallbackEmotions(transcriptData);
    result.dominantEmotion = result.emotions[0]?.emotion || 'Neutral';
    result.emotionTimeline = generateEmotionTimeline(transcriptData, result.emotions);
  }
  setStage(2, 'done', `Dominant: ${result.dominantEmotion}`); setProgress(70);

  // Stage 3: Voice analysis
  setStage(3, 'active', 'Analyzing pitch & volume...');
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const arrBuf = await audioBlob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrBuf);
    result.pitchData = analyzePitch(audioBuffer);
    result.volumeData = analyzeVolume(audioBuffer);
    result.vocalVarietyScore = calculateVocalVariety(result.pitchData);
    audioCtx.close();
  } catch(e) {
    console.warn('Audio analysis failed:', e);
    result.pitchData = generateFallbackPitch(result.duration);
    result.volumeData = generateFallbackVolume(result.duration);
    result.vocalVarietyScore = 50;
  }
  setStage(3, 'done', `Pitch & volume mapped`); setProgress(85);

  // Stage 4: Recommendations
  setStage(4, 'active', 'Generating personalized insights...');
  result.overallScore = calculateOverallScore(result);
  result.recommendations = generateRecommendations(result);
  setStage(4, 'done', `${result.recommendations.length} insights generated`); setProgress(100);

  return result;
}
