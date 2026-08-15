const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/stt', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file uploaded.' });

  const filePath = req.file.path;

  try {
    const key = process.env.ASSEMBLYAI_API_KEY;
    if (!key) {
      fs.unlinkSync(filePath);
      return res.status(501).json({ error: 'STT not configured on server. Set ASSEMBLYAI_API_KEY in environment.' });
    }

    // Upload the file to AssemblyAI
    const uploadResp = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { authorization: key, 'Transfer-Encoding': 'chunked' },
      body: fs.createReadStream(filePath)
    });

    if (!uploadResp.ok) throw new Error(`Upload failed: ${uploadResp.status}`);
    const uploadJson = await uploadResp.json();
    const audio_url = uploadJson.upload_url;

    // Request transcription
    const createResp = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: { authorization: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_url })
    });

    if (!createResp.ok) throw new Error(`Transcript creation failed: ${createResp.status}`);
    const createJson = await createResp.json();
    const id = createJson.id;

    // Poll for completion
    let transcriptText = null;
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const poll = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, { headers: { authorization: key } });
      const pollJson = await poll.json();
      if (pollJson.status === 'completed') {
        transcriptText = pollJson.text;
        break;
      }
      if (pollJson.status === 'error') {
        throw new Error(pollJson.error || 'Transcription failed');
      }
    }

    fs.unlinkSync(filePath);

    if (!transcriptText) return res.status(202).json({ error: 'Transcription in progress. Try again later.' });
    return res.json({ text: transcriptText });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error(err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`EVANDAB server listening on port ${PORT}`);
});
