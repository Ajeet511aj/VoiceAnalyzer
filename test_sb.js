const URL = 'https://zzkazyaacmshvguospgj.supabase.co';
const ANON = 'sb_publishable_Gy0v4G9VzROwzSC-d8ji_w_UfiWh23D';

fetch(`${URL}/rest/v1/analyses`, {
  method: 'POST',
  headers: {
    'apikey': ANON,
    'Authorization': `Bearer ${ANON}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    title: 'Test',
    status: 'completed',
    user_id: '123e4567-e89b-12d3-a456-426614174000', // random fake uuid
    duration: 120,
    transcript: 'test',
    words: [],
    filler_words: [],
    wpm_average: 150,
    wpm_data: [],
    pitch_data: [],
    volume_data: [],
    emotions: {},
    emotion_timeline: [],
    dominant_emotion: 'happy',
    overall_score: 80,
    vocal_variety_score: 75,
    pauses: [],
    recommendations: [],
    assembly_ai_id: 'some-id'
  })
})
.then(async r => {
  console.log('Status:', r.status);
  console.log('Response:', await r.text());
})
.catch(console.error);
