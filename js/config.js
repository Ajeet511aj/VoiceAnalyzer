// ═══════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════
var CONFIG = {
  SUPABASE_URL: 'https://zzkazyaacmshvguospgj.supabase.co',
  SUPABASE_ANON: 'sb_publishable_Gy0v4G9VzROwzSC-d8ji_w_UfiWh23D',
  ASSEMBLY_KEY: 'd1adc5f1170a43cbb318558116ea3a33',
  HF_TOKEN: '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',
  HF_MODEL: 'ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition',
  FILLERS: ['um','uh','like','basically','literally','actually','right','okay','so','you know'],
};

// ═══════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════
var State = {
  view: 'auth',
  user: null,
  profile: null,
  currentAnalysis: null,
  analyses: [],
  recording: false,
  audioBlob: null,
  audioURL: null,
  audioBuffer: null,
  audioContext: null,
  mediaRecorder: null,
  audioChunks: [],
  waveformAnim: null,
  recordingTimer: null,
  recordingSeconds: 0,
  audioElement: null,
  charts: {},
  processingStages: [],
  activeTab: 'overview',
};

var supabaseClient = null;

