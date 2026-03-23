const key = 'd1adc5f1170a43cbb318558116ea3a33';

async function test() {
  const res = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: { 'Authorization': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audio_url: 'https://assemblyai.github.io/assemblyai-api-cookbook/test-audio.mp3',
      sentiment_analysis: true,
      auto_highlights: true,
      word_boost: ['um','uh','like'],
    })
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
test();
