const key = 'd1adc5f1170a43cbb318558116ea3a33';

fetch('https://api.assemblyai.com/v2/upload', {
  method: 'POST',
  headers: {
    'Authorization': key,
    'Content-Type': 'application/octet-stream'
  },
  body: Buffer.from('dummy')
})
.then(r => {
  console.log('Status:', r.status);
  return r.text();
})
.then(t => console.log('Response:', t))
.catch(e => console.error('Error:', e));
