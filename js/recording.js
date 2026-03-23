// ═══════════════════════════════════════════════
//  RECORDING
// ═══════════════════════════════════════════════
async function toggleRecording() {
  if (!State.recording) await startRecording();
  else stopAndAnalyze();
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    State.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = State.audioContext.createMediaStreamSource(stream);
    const analyser = State.audioContextAnalyser = State.audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    State.mediaRecorder = new MediaRecorder(stream);
    State.audioChunks = [];
    State.mediaRecorder.ondataavailable = e => { if(e.data.size > 0) State.audioChunks.push(e.data); };
    State.mediaRecorder.start(100);
    State.recording = true;
    State.recordingSeconds = 0;

    // Fix for browsers that suspend AudioContext
    if (State.audioContext.state === 'suspended') {
      await State.audioContext.resume();
    }

    // UI
    const micBtn = document.getElementById('mic-btn');
    const waveform = document.getElementById('waveform');
    const timer = document.getElementById('rec-timer');
    const controls = document.getElementById('rec-controls');
    const status = document.getElementById('rec-status');
    const volInd = document.getElementById('volume-indicator');
    const volFill = document.getElementById('volume-fill');

    if(micBtn) { micBtn.classList.remove('idle'); micBtn.classList.add('recording'); micBtn.innerHTML='⏺️'; }
    if(waveform) waveform.classList.remove('hidden');
    if(timer) timer.classList.remove('hidden');
    if(controls) controls.classList.remove('hidden');
    if(volInd) volInd.classList.remove('hidden');
    if(status) status.textContent = 'Recording... Click "Stop & Analyze" when done';

    startWaveformLoop(analyser, null, null, volFill);

    // Timer
    State.recordingTimer = setInterval(() => {
      State.recordingSeconds++;
      const m = Math.floor(State.recordingSeconds / 60).toString().padStart(2,'0');
      const s = (State.recordingSeconds % 60).toString().padStart(2,'0');
      const el = document.getElementById('rec-timer');
      if(el) el.textContent = `${m}:${s}`;
    }, 1000);

  } catch(err) {
    console.error(err);
    toast('Microphone access denied. Please allow microphone permission.', 'error');
  }
}

function startWaveformLoop(analyser, ctx2, dataArr, volFill) {
    if (!analyser) analyser = State.audioContextAnalyser;
    if (!analyser) return;

    if (!dataArr) dataArr = new Uint8Array(analyser.fftSize); // Use full fftSize
    if (!ctx2) {
        const canvas = document.getElementById('waveform');
        ctx2 = canvas?.getContext('2d');
    }
    if (!volFill) volFill = document.getElementById('volume-fill');

    function draw() {
      if (!State.recording || (State.mediaRecorder && State.mediaRecorder.state === 'paused')) return;
      State.waveformAnim = requestAnimationFrame(draw);
      
      // Waveform
      analyser.getByteTimeDomainData(dataArr);
      if (ctx2 && ctx2.canvas) {
        ctx2.fillStyle = '#161A27';
        ctx2.fillRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
        ctx2.lineWidth = 2;
        ctx2.strokeStyle = '#00D4FF';
        ctx2.beginPath();
        const sliceW = ctx2.canvas.width / dataArr.length;
        let x = 0;
        for (let i = 0; i < dataArr.length; i++) {
          const v = dataArr[i] / 128;
          const y = v * ctx2.canvas.height / 2;
          i === 0 ? ctx2.moveTo(x, y) : ctx2.lineTo(x, y);
          x += sliceW;
        }
        ctx2.lineTo(ctx2.canvas.width, ctx2.canvas.height / 2);
        ctx2.stroke();
      }

      // Volume Strength (Peak detection is often more responsive for indicators)
      let maxVal = 0;
      for(let i=0; i<dataArr.length; i++) {
        const val = Math.abs(dataArr[i] - 128);
        if (val > maxVal) maxVal = val;
      }
      
      // Normalize to 0-100 (maxVal is 0-128)
      const vol = Math.min(100, Math.round((maxVal / 128) * 100 * 1.5)); 
      
      if (volFill) {
        volFill.style.width = `${vol}%`;
        if (vol > 80) volFill.style.background = 'var(--red)';
        else if (vol > 50) volFill.style.background = 'var(--amber)';
        else volFill.style.background = 'var(--grad)';
      }
    }
    draw();
}

function pauseRecording() {
  if (!State.mediaRecorder) return;
  const btn = document.getElementById('btn-pause');
  if (State.mediaRecorder.state === 'recording') {
    State.mediaRecorder.pause();
    if(btn) btn.innerHTML = '▶️ Resume';
    clearInterval(State.recordingTimer);
    cancelAnimationFrame(State.waveformAnim);
  } else if (State.mediaRecorder.state === 'paused') {
    State.mediaRecorder.resume();
    if(btn) btn.innerHTML = '⏸ Pause';
    State.recordingTimer = setInterval(() => {
      State.recordingSeconds++;
      const m = Math.floor(State.recordingSeconds / 60).toString().padStart(2,'0');
      const s = (State.recordingSeconds % 60).toString().padStart(2,'0');
      const el = document.getElementById('rec-timer');
      if(el) el.textContent = `${m}:${s}`;
    }, 1000);
    // Restart waveform
    startWaveformLoop();
  }
}

function startWaveformLoop() {
    // Helper to restart visual loop if needed
}

function stopAndAnalyze() {
  if (!State.mediaRecorder) return;
  cancelAnimationFrame(State.waveformAnim);
  clearInterval(State.recordingTimer);
  State.recording = false;

  State.mediaRecorder.stop();
  State.mediaRecorder.stream.getTracks().forEach(t => t.stop());
  State.mediaRecorder.onstop = () => {
    State.audioBlob = new Blob(State.audioChunks, { type: 'audio/webm' });
    State.audioURL = URL.createObjectURL(State.audioBlob);
    navigate('processing');
  };
}

async function resetRecording() {
    if (!confirm('Are you sure you want to restart the recording? Your current progress will be lost.')) return;
    
    // Stop current
    if (State.mediaRecorder) {
        cancelAnimationFrame(State.waveformAnim);
        clearInterval(State.recordingTimer);
        State.recording = false;
        try {
            State.mediaRecorder.stop();
            State.mediaRecorder.stream.getTracks().forEach(t => t.stop());
        } catch(e){}
    }
    
    // Reset UI
    const timer = document.getElementById('rec-timer');
    if(timer) timer.textContent = '00:00';
    const volFill = document.getElementById('volume-fill');
    if(volFill) volFill.style.width = '0%';

    // Restart
    await startRecording();
}
function handleFileSelect(e) {
  const f = e.target.files[0];
  if (f) processSelectedFile(f);
}

function processSelectedFile(file) {
  const allowed = ['audio/mp3','audio/mpeg','audio/wav','audio/x-wav','audio/m4a','audio/x-m4a','audio/ogg','audio/flac','audio/webm','audio/mp4'];
  const ext = file.name.split('.').pop().toLowerCase();
  const allowedExts = ['mp3','wav','m4a','ogg','flac','webm','mp4'];
  if (!allowedExts.includes(ext)) { toast('Unsupported file format. Use MP3, WAV, M4A, OGG, FLAC, or WebM.', 'error'); return; }
  if (file.size > 50 * 1024 * 1024) { toast('File too large. Max 50MB for free tier.', 'error'); return; }
  State.audioBlob = file;
  State.audioURL = URL.createObjectURL(file);
  const info = document.getElementById('upload-file-info');
  const fname = document.getElementById('upload-fname');
  const fsize = document.getElementById('upload-fsize');
  const dz = document.getElementById('drop-zone');
  if(info) info.classList.remove('hidden');
  if(dz) dz.classList.add('hidden');
  if(fname) fname.textContent = file.name;
  if(fsize) fsize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
}

function clearUpload() {
  State.audioBlob = null; State.audioURL = null;
  const info = document.getElementById('upload-file-info');
  const dz = document.getElementById('drop-zone');
  if(info) info.classList.add('hidden');
  if(dz) dz.classList.remove('hidden');
  const fi = document.getElementById('file-input');
  if(fi) fi.value = '';
}

function analyzeUploadedFile() {
  if (!State.audioBlob) { toast('No file selected','error'); return; }
  navigate('processing');
}
