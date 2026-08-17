const languageSelect = document.getElementById('languageSelect');
const micButton = document.getElementById('micButton');
const readyButton = document.getElementById('readyButton');
const stopButton = document.getElementById('stopButton');
const historyButton = document.getElementById('historyButton');
const clearHistoryButton = document.getElementById('clearHistoryButton');
const toggleHistoryButton = document.getElementById('toggleHistoryButton');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const statusText = document.getElementById('statusText');
const responseText = document.getElementById('responseText');
const liveLanguage = document.getElementById('liveLanguage');

const languageNames = {
  ig: 'Igbo',
  yo: 'Yoruba',
  ha: 'Hausa'
};

const languageCodes = {
  ig: 'ig-NG',
  yo: 'yo-NG',
  ha: 'ha-NG'
};

const WAKE_PHRASE = 'hay evan';
const TARGET_WINDOW_NAME = 'evan_assistant_target';
const commandPatterns = [
  { intent: 'OPEN_GOOGLE', keywords: ['google', 'open google', 'go to google', 'search google', 'meghee google', 'mepee google', 'bude google', 'sii google', 'ṣii google', 'bude google search', 'kawo google'] },
  { intent: 'OPEN_YOUTUBE', keywords: ['youtube', 'open youtube', 'go to youtube', 'meghee youtube', 'mepee youtube', 'bude youtube', 'sii youtube', 'ṣii youtube', 'kawo youtube'] },
  { intent: 'SEARCH_WEB', keywords: ['search', 'search web', 'browse', 'find', 'nchọpụta', 'search for', 'saka', 'bincike', 'bincika', 'nchoputa'] },
  { intent: 'OPEN_CALCULATOR', keywords: ['calculator', 'open calculator', 'calculator app', 'igwe mgbako', 'kalkulator', 'calculator on', 'kawo calculator'] },
  { intent: 'READ_NEWS', keywords: ['news', 'read news', 'open news', 'latest news', 'maliwu okwu', 'labarun', 'kawo labarai', 'labarai'] },
  { intent: 'CHECK_WEATHER', keywords: ['weather', 'check weather', 'weather report', 'rain', 'temperature', 'nchọpụta ihu igwe', 'ojo oju', 'yanayin rana', 'kawo yanayi'] },
  { intent: 'OPEN_WHATSAPP', keywords: ['whatsapp', 'open whatsapp', 'meghee whatsapp', 'mepee whatsapp', 'bude whatsapp', 'sii whatsapp', 'ṣii whatsapp', 'kawo whatsapp'] },
  { intent: 'OPEN_EMAIL', keywords: ['email', 'open email', 'gmail', 'mail', 'imeel', 'i-mel', 'kawo mail', 'kawo email'] },
  { intent: 'OPEN_CAMERA', keywords: ['camera', 'open camera', 'take photo', 'camera app', 'kamara', 'kamarar', 'kawo camera'] },
  { intent: 'OPEN_MAP', keywords: ['map', 'open map', 'maps', 'navigate', 'location', 'mape', 'taswirar', 'kawo map'] },
  { intent: 'OPEN_MESSAGE', keywords: ['message', 'open message', 'messages', 'sms', 'msg', 'zaa', 'saƙo', 'kawo saƙo'] },
  { intent: 'OPEN_MUSIC', keywords: ['music', 'play music', 'open music', 'song', 'audio', 'music player', 'igbo egwu', 'orin', 'kawo kiɗa'] },
  { intent: 'OPEN_CONTACT', keywords: ['contact', 'open contact', 'contacts', 'people', 'phonebook', 'mgbasa ozi', 'kuntact', 'lissafi na wayar'] },
  { intent: 'OPEN_SETTINGS', keywords: ['settings', 'open settings', 'configuration', 'preferences', 'mgbasa', 'saituna', 'kawo settings'] },
  { intent: 'OPEN_GALLERY', keywords: ['gallery', 'open gallery', 'photos', 'pictures', 'gallery app', 'galleri', 'kawo gallery'] },
  { intent: 'OPEN_PHOTO', keywords: ['photo', 'open photo', 'picture', 'image', 'pictures', 'photo app', 'foto', 'kawo foto'] },
  { intent: 'OPEN_VIDEO', keywords: ['video', 'open video', 'play video', 'watch video', 'videos', 'vidio', 'kawo bidiyo'] },
  { intent: 'OPEN_PLAY_STORE', keywords: ['play store', 'open play store', 'app store', 'store', 'playstore', 'store app', 'kawo play store'] },
  { intent: 'OPEN_MEET', keywords: ['meet', 'open meet', 'google meet', 'meeting', 'video call', 'miti', 'kawo meet'] },
  { intent: 'OPEN_DRIVE', keywords: ['drive', 'open drive', 'google drive', 'cloud storage', 'drive app', 'kawo drive'] },
  { intent: 'OPEN_CALENDAR', keywords: ['calendar', 'calender', 'open calendar', 'schedule', 'agenda', 'kalenda', 'kawo kalenda'] },
  { intent: 'OPEN_FACEBOOK', keywords: ['facebook', 'open facebook', 'meghee facebook', 'mepee facebook', 'bude facebook', 'sii facebook', 'ṣii facebook', 'kawo facebook'] },
  { intent: 'OPEN_FACEBOOK_LITE', keywords: ['facebook lite', 'open facebook lite', 'facebook light', 'lite facebook', 'kawo facebook lite'] },
  { intent: 'OPEN_WHATSAPP_BUSINESS', keywords: ['whatsapp business', 'open whatsapp business', 'business whatsapp', 'waba business', 'kawo whatsapp business'] },
  { intent: 'OPEN_PHONE', keywords: ['phone', 'open phone', 'smartphone', 'dialer', 'waya', 'kawo phone'] },
  { intent: 'OPEN_APP', keywords: ['open', 'launch', 'start', 'run', 'meghee', 'mepee', 'bude', 'sii', 'ṣii', 'kawo'] }
];

const languageHints = {
  ig: ['igbo', 'meghee', 'mepee', 'bido', 'gosi', 'maka', 'nwa', 'igbo language'],
  yo: ['yoruba', 'ṣii', 'sii', 'ṣe', 'fi', 'ya', 'gbogbo', 'yoruba language'],
  ha: ['hausa', 'bude', 'kawo', 'kwano', 'fito', 'nemi', 'hausa language'],
  en: ['english', 'open', 'search', 'google', 'youtube']
};

const responseCatalog = {
  OPEN_GOOGLE: { en: 'Google has been opened.', ig: 'Google emegheela.', yo: 'Google ti ṣii.', ha: 'An buɗe Google.' },
  OPEN_YOUTUBE: { en: 'YouTube has been opened.', ig: 'YouTube emegheela.', yo: 'YouTube ti ṣii.', ha: 'An buɗe YouTube.' },
  OPEN_WHATSAPP: { en: 'WhatsApp has been opened.', ig: 'WhatsApp emegheela.', yo: 'WhatsApp ti ṣii.', ha: 'An buɗe WhatsApp.' },
  OPEN_EMAIL: { en: 'Your email service has been opened.', ig: 'Email gị emegheela.', yo: 'Imeeli rẹ ti ṣii.', ha: 'An buɗe imel ɗin ku.' },
  OPEN_MAP: { en: 'The map service has been opened.', ig: 'Map emegheela.', yo: 'Maapu ti ṣii.', ha: 'An buɗe taswira.' },
  OPEN_MEET: { en: 'Google Meet has been opened.', ig: 'Google Meet emegheela.', yo: 'Google Meet ti ṣii.', ha: 'An buɗe Google Meet.' },
  OPEN_PLAY_STORE: { en: 'The Play Store has been opened.', ig: 'Play Store emegheela.', yo: 'Play Store ti ṣii.', ha: 'An buɗe Play Store.' },
  OPEN_FACEBOOK: { en: 'Facebook has been opened.', ig: 'Facebook emegheela.', yo: 'Facebook ti ṣii.', ha: 'An buɗe Facebook.' },
  OPEN_FACEBOOK_LITE: { en: 'Facebook Lite has been opened.', ig: 'Facebook Lite emegheela.', yo: 'Facebook Lite ti ṣii.', ha: 'An buɗe Facebook Lite.' },
  OPEN_MUSIC: { en: 'A music service has been opened.', ig: 'Emechiela egwu.', yo: 'Orin ti ṣii.', ha: 'An buɗe kiɗa.' },
  OPEN_NEWS: { en: 'News has been opened.', ig: 'Akụkọ emegheela.', yo: 'Àkójọ́ lẹ́rù.', ha: 'An buɗe labarai.' },
  CHECK_WEATHER: { en: 'Weather information is being checked.', ig: 'Ana-enyocha ihu igwe.', yo: 'A n ṣe ayẹwo oju ojo.', ha: 'Ina duba yanayin lokaci.' },
  SEARCH_WEB: { en: 'Searching the web for your request.', ig: 'Ana-acho ihe maka arịrịọ gị.', yo: 'N nà wá ibi ti o fẹ lori ayelujara.', ha: 'Ina neman buƙatar ku a yanar gizo.' },
  UNKNOWN: { en: 'I did not understand that command. Please say it again.', ig: 'A naghị aghọta iwu a. Biko kwuo ya ọzọ.', yo: 'A ko ye aṣẹ yii. Jọwọ sọ lẹẹkansi.', ha: 'Ba na fahimtar wannan umarnin ba. Don Allah sake maimaita.' }
};

let recognition;
let isListening = false;
let wakeActivated = false;
let idleTimer = null;
let historyItems = [];
let showingAllHistory = false;
let mediaRecorder = null;
let recordedChunks = [];
let speechSilenceTimer = null;
let lastTranscript = '';
let lastProcessedTranscript = '';
let processingLock = false;
let sessionTimer = null;
const SESSION_TIMEOUT_MS = 60_000; // 1 minute active listening after wake
let SILENCE_TIMEOUT_MS = 1200; // ms of silence to consider end of utterance (tunable)
let audioContextGlobal = null;
let analyserGlobal = null;
let energyBuffer = [];
const ENERGY_BUFFER_MAX = 120; // keep ~2s of frames
let noiseFloor = 0;
let lastSpeechEnergyTime = 0;
let SPEECH_ENERGY_MARGIN = 1.6; // factor above noise floor to consider speech (tunable)
let lastActionTime = 0;
let ACTION_COOLDOWN_MS = 2500; // minimum time between actions for same transcript (tunable)
let MIN_WORDS_FOR_COMMAND = 2; // ignore too-short transcripts (tunable)
let WAKE_PHRASE_MARGIN = 1.2; // lower margin for wake phrase detection (tunable, for low voices)
let wakeActivationDelay = 3000; // 3 seconds delay after wake phrase detection
let wakeActivationTimer = null;

// Backend origin configuration (set in index.html as window.BACKEND_ORIGIN)
const BACKEND_ORIGIN = (typeof window !== 'undefined' && window.BACKEND_ORIGIN) ? String(window.BACKEND_ORIGIN).replace(/\/$/, '') : '';

// Helper to check if a valid language is selected
function isLanguageSelected() {
  const selected = languageSelect.value;
  return selected && selected !== '';
}

// Save language selection to localStorage
function saveLanguagePreference(langCode) {
  try {
    localStorage.setItem('evan_language_preference', langCode);
  } catch (e) {}
}

// Load language preference from localStorage
function loadLanguagePreference() {
  try {
    const saved = localStorage.getItem('evan_language_preference');
    if (saved && languageCodes[saved]) {
      return saved;
    }
  } catch (e) {}
  return '';
}

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[.,!?;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function setStatus(message) {
  statusText.textContent = message;
}

// Compute band-limited energy (300-3400 Hz) from analyser frequency data
function getBandEnergy(analyser, sampleRate, low = 300, high = 3400) {
  if (!analyser) return 0;
  const fftSize = analyser.fftSize || 2048;
  const binCount = analyser.frequencyBinCount;
  const data = new Uint8Array(binCount);
  analyser.getByteFrequencyData(data);
  const binFreq = sampleRate / fftSize;
  const startBin = Math.max(0, Math.floor(low / binFreq));
  const endBin = Math.min(binCount - 1, Math.ceil(high / binFreq));
  let sum = 0;
  for (let i = startBin; i <= endBin; i++) sum += data[i];
  return (sum / (endBin - startBin + 1)) || 0;
}

// Start a background sampler to maintain energyBuffer and noiseFloor
function startEnergySamplerOnce(sampleRate) {
  if (!analyserGlobal) return;
  if (startEnergySamplerOnce._running) return;
  startEnergySamplerOnce._running = true;

  const frame = () => {
    try {
      const e = getBandEnergy(analyserGlobal, sampleRate);
      energyBuffer.push(e);
      if (energyBuffer.length > ENERGY_BUFFER_MAX) energyBuffer.shift();

      const sorted = energyBuffer.slice().sort((a, b) => a - b);
      const idx = Math.floor(sorted.length * 0.2);
      noiseFloor = sorted[idx] || noiseFloor || 0;

      if (e > Math.max(2, noiseFloor * SPEECH_ENERGY_MARGIN)) {
        lastSpeechEnergyTime = Date.now();
      }
    } catch (err) {
      // ignored
    }
    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function containsWakePhrase(text) {
  const normalized = normalizeText(text);
  return normalized.includes(WAKE_PHRASE) || normalized.includes('hey evan');
}

function stripWakePhrase(text) {
  const normalized = normalizeText(text);
  if (normalized.includes(WAKE_PHRASE)) {
    return normalized.replace(WAKE_PHRASE, '').trim();
  }
  if (normalized.includes('hey evan')) {
    return normalized.replace('hey evan', '').trim();
  }
  return normalized;
}

function detectLanguage(text) {
  const normalized = normalizeText(text);
  const scores = { ig: 0, yo: 0, ha: 0, en: 0 };

  Object.entries(languageHints).forEach(([lang, hints]) => {
    hints.forEach((hint) => {
      if (normalized.includes(hint)) scores[lang] += 2;
    });
  });

  const bestMatch = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return bestMatch && bestMatch[1] > 0 ? bestMatch[0] : (languageSelect.value === 'auto' ? 'en' : languageSelect.value);
}

function inferIntent(text) {
  const normalized = normalizeText(text);
  for (const pattern of commandPatterns) {
    if (pattern.keywords.some((keyword) => normalized.includes(keyword))) {
      return pattern.intent;
    }
  }

  if (normalized.includes('weather')) return 'CHECK_WEATHER';
  if (normalized.includes('news')) return 'READ_NEWS';
  if (normalized.includes('search') || normalized.includes('find')) return 'SEARCH_WEB';
  return 'UNKNOWN';
}

function extractSearchQuery(text) {
  const normalized = normalizeText(text);
  const match = normalized.match(/(?:search|find)(?: for)?\s+(.*)$/i);
  return match ? match[1].trim() : normalized;
}

function openTargetWindow(url) {
  if (!url) return;

  try {
    const existingWindow = window.open('', TARGET_WINDOW_NAME, 'noopener,noreferrer');
    if (existingWindow && !existingWindow.closed) {
      existingWindow.location.href = url;
      existingWindow.focus();
      return;
    }

    const newWindow = window.open(url, TARGET_WINDOW_NAME, 'noopener,noreferrer');
    if (newWindow) {
      newWindow.focus();
      return;
    }

    window.location.href = url;
  } catch (error) {
    window.location.href = url;
  }
}

function getActionUrl(intent) {
  const urlMap = {
    OPEN_GOOGLE: 'https://www.google.com',
    OPEN_YOUTUBE: 'https://www.youtube.com',
    SEARCH_WEB: 'https://www.google.com/search?q=',
    OPEN_WHATSAPP: 'https://web.whatsapp.com',
    OPEN_EMAIL: 'https://mail.google.com',
    OPEN_MAP: 'https://www.google.com/maps',
    OPEN_MEET: 'https://meet.google.com',
    OPEN_PLAY_STORE: 'https://play.google.com/store',
    OPEN_FACEBOOK: 'https://www.facebook.com',
    OPEN_FACEBOOK_LITE: 'https://lite.facebook.com',
    OPEN_MUSIC: 'https://open.spotify.com',
    OPEN_NEWS: 'https://news.google.com',
    CHECK_WEATHER: 'https://www.google.com/search?q=weather',
    READ_NEWS: 'https://news.google.com'
  };

  return urlMap[intent] || null;
}

// App deep-link and website resolver: attempts to open an app or website by name
function resolveTargetFromText(text) {
  const normalized = normalizeText(text);

  // If user said something like "open twitter.com" or includes a dot, open as URL
  const domainMatch = normalized.match(/([\w-]+\.)+[a-z]{2,}(\/\S*)?/i);
  if (domainMatch) {
    let url = domainMatch[0];
    if (!url.startsWith('http')) url = 'https://' + url;
    return url;
  }

  // extract words after open/launch/run
  const openMatch = normalized.match(/(?:open|launch|start|run|kawo|bude|mepee|meghee|sii|ṣii)\s+(.*)$/i);
  let target = openMatch ? openMatch[1].trim() : normalized;

  // Known app scheme map
  const schemes = {
    whatsapp: 'https://web.whatsapp.com',
    telegram: 'https://web.telegram.org',
    youtube: 'https://www.youtube.com',
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    twitter: 'https://twitter.com',
    spotify: 'https://open.spotify.com',
    maps: 'https://www.google.com/maps',
    gmail: 'https://mail.google.com',
    chrome: 'googlechrome://',
    calculator: 'calculator://',
    camera: 'camera://'
  };

  // try exact name
  const firstWord = target.split(' ')[0];
  if (schemes[firstWord]) return schemes[firstWord];

  // try removing 'app' or 'app store' words
  target = target.replace(/\b(app|application|store|play store|app store)\b/gi, '').trim();

  // fallback: open a Google search for the target
  return 'https://www.google.com/search?q=' + encodeURIComponent(target);
}

function executeAction(intent, text) {
  if (intent === 'UNKNOWN') {
    return { intent, status: 'unknown', message: responseCatalog.UNKNOWN.en };
  }

  // First try predefined mapping
  let url = getActionUrl(intent);

  // If no mapped url, and the command is OPEN_APP or OPEN_APP generic, try resolver
  if (!url && (intent === 'OPEN_APP' || intent === 'OPEN_GOOGLE' || intent === 'SEARCH_WEB' || intent === 'OPEN_YOUTUBE' || intent === 'OPEN_WHATSAPP' || intent === 'OPEN_EMAIL' || intent === 'OPEN_MAP')) {
    url = resolveTargetFromText(text);
  }

  if (url) {
    if (intent === 'SEARCH_WEB') {
      openTargetWindow(`${url}${encodeURIComponent(extractSearchQuery(text))}`);
    } else {
      openTargetWindow(url);
    }
  }

  return {
    intent,
    status: 'ok',
    message: responseCatalog[intent]?.en || responseCatalog.UNKNOWN.en,
    url
  };
}

function buildLocalizedMessage(intent, text, languageKey, action) {
  const lang = languageKey && languageKey !== 'auto' ? languageKey : 'en';

  if (intent === 'UNKNOWN' || action.status === 'unknown') {
    return responseCatalog.UNKNOWN[lang] || responseCatalog.UNKNOWN.en;
  }

  if (intent === 'SEARCH_WEB') {
    const template = responseCatalog.SEARCH_WEB[lang] || responseCatalog.SEARCH_WEB.en;
    return template.replace('your request', extractSearchQuery(text));
  }

  if (intent === 'CHECK_WEATHER') {
    return responseCatalog.CHECK_WEATHER[lang] || responseCatalog.CHECK_WEATHER.en;
  }

  if (intent === 'READ_NEWS') {
    return responseCatalog.OPEN_NEWS[lang] || responseCatalog.OPEN_NEWS.en;
  }

  return responseCatalog[intent]?.[lang] || responseCatalog[intent]?.en || responseCatalog.UNKNOWN.en;
}

function renderHistory() {
  if (!historyItems.length) {
    historyList.innerHTML = '<li class="empty">No commands yet.</li>';
    toggleHistoryButton.classList.add('hidden');
    toggleHistoryButton.textContent = 'See more';
    showingAllHistory = false;
    return;
  }

  const visibleHistory = showingAllHistory ? historyItems.slice().reverse() : historyItems.slice().reverse().slice(0, 5);

  historyList.innerHTML = visibleHistory
    .map((item) => `
      <li>
        <strong>${item.language}</strong> · <small style="color:var(--muted)">${new Date(item.timestamp).toLocaleString()}</small><br />
        <span>${item.command}</span><br />
        <small>${item.result}</small>
      </li>
    `)
    .join('');

  if (historyItems.length > 5) {
    toggleHistoryButton.classList.remove('hidden');
    toggleHistoryButton.textContent = showingAllHistory ? 'See less' : 'See more';
  } else {
    toggleHistoryButton.classList.add('hidden');
    toggleHistoryButton.textContent = 'See more';
    showingAllHistory = false;
  }
}

function saveHistory() {
  try {
    localStorage.setItem('evan_assistant_history', JSON.stringify(historyItems));
  } catch (error) {
    // Ignore storage errors.
  }
}

function addHistory(command, language, result) {
  const entry = { command, language, result, timestamp: new Date().toISOString() };
  historyItems.push(entry);
  renderHistory();
  saveHistory();
}

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem('evan_assistant_history') || '[]');
    if (Array.isArray(saved)) {
      historyItems = saved.map((h) => {
        // ensure older entries without timestamp get a timestamp
        if (!h.timestamp) h.timestamp = new Date().toISOString();
        return h;
      });
    }
  } catch (error) {
    historyItems = [];
  }
}

async function uploadAudioToServer(blob) {
  try {
    const form = new FormData();
    form.append('audio', blob, 'recording.webm');

    const endpoint = (BACKEND_ORIGIN || '') + '/stt';
    const res = await fetch(endpoint, { method: 'POST', body: form });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.error || `Server returned ${res.status}` };
    }

    const json = await res.json();
    return json;
  } catch (err) {
    return { error: err.message || String(err) };
  }
}

function speakResponse(text, languageKey) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  // Always use the selected language; no auto-detection fallback
  const selected = languageSelect.value || 'en';
  const code = languageCodes[selected] || 'en-US';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = code;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith(code.slice(0, 2))) || voices[0];
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function resetIdleTimer() {
  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  if (!wakeActivated) {
    return;
  }

  idleTimer = setTimeout(() => {
    if (wakeActivated) {
      stopListening();
      setStatus('No command detected. Say "HAY EVAN" or tap Ready to Listen to start again.');
      responseText.textContent = 'No command was detected. The assistant is waiting.';
    }
  }, 15000);
}

function handleCommand(text) {
  // Require language selection
  if (!isLanguageSelected()) {
    setStatus('Please select a language before giving commands.');
    responseText.textContent = 'Please select a language first.';
    return;
  }

  const cleanedText = normalizeText(text);
  if (!cleanedText) {
    return;
  }

  // Use only the selected language; no auto-detection
  const selectedLanguage = languageSelect.value;
  const languageLabel = languageNames[selectedLanguage] || selectedLanguage;
  const intent = inferIntent(cleanedText);
  const action = executeAction(intent, cleanedText);
  const finalMessage = buildLocalizedMessage(intent, cleanedText, selectedLanguage, action);

  liveLanguage.textContent = `Language: ${languageLabel}`;
  responseText.textContent = finalMessage;
  setStatus(`Intent detected: ${intent}`);

  addHistory(cleanedText, languageLabel, finalMessage);
  speakResponse(finalMessage, selectedLanguage);
  
  // After command is executed, keep assistant active for more commands
  // Assistant stays active with wakeActivated = true
  setStatus('Ready for next command.');
  resetIdleTimer();
}

function stopListening() {
  wakeActivated = false;

  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }

  if (recognition) {
    recognition.stop();
  }

  isListening = false;
  micButton.textContent = 'Listening for wake phrase';
  readyButton.textContent = 'Ready to Listen';
  setStatus('Listening stopped. Say "HAY EVAN" or tap Ready to Listen to activate again.');
}

function startWakeListening() {
  // Require language selection before listening
  if (!isLanguageSelected()) {
    setStatus('Please select a language before starting the assistant.');
    responseText.textContent = 'Please select a language first.';
    micButton.textContent = 'Select Language';
    return;
  }

  if (!isOnline()) {
    setStatus('Internet connection is off. Please turn on mobile data or Wi‑Fi.');
    responseText.textContent = 'Internet connection is required to activate the assistant.';
    return;
  }

  const hasSpeechAPI = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  if (!hasSpeechAPI) {
    // Fallback: inform user that live browser recognition isn't available. The Ready button will record audio and upload it.
    setStatus('Browser speech recognition not available — using audio upload fallback. Tap Ready to Listen and speak.');
    responseText.textContent = 'Tap Ready to Listen and speak; audio will be uploaded for transcription.';
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = languageCodes[languageSelect.value] || 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  // Try to create an analyser to monitor audio energy for VAD/noise estimation.
  if (!analyserGlobal) {
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        try {
          audioContextGlobal = new (window.AudioContext || window.webkitAudioContext)();
          const src = audioContextGlobal.createMediaStreamSource(stream);
          analyserGlobal = audioContextGlobal.createAnalyser();
          analyserGlobal.fftSize = 2048;
          src.connect(analyserGlobal);
          // start a lightweight sampler to update noise floor
          sampleEnergyFrame();
        } catch (e) {
          // ignore analyser errors
          analyserGlobal = null;
        }
      }).catch(() => { analyserGlobal = null; });
    } catch (e) { analyserGlobal = null; }
  }

  recognition.onstart = () => {
    isListening = true;
    if (!wakeActivated) {
      setStatus('Waiting for wake phrase: HAY EVAN');
      micButton.textContent = 'Listening for wake phrase';
    } else {
      setStatus('Assistant is active. Speak your command.');
      micButton.textContent = 'Assistant is active';
      readyButton.textContent = 'Listening';
    }
    resetIdleTimer();
  };

  recognition.onerror = (event) => {
    isListening = false;

    console.error("Speech recognition error:", event.error);

    let message = `Speech error: ${event.error}`;

    if (event.error === "not-allowed") {
        message = "Microphone permission was denied. Please allow microphone access.";
    }

    if (event.error === "audio-capture") {
        message = "The microphone could not be accessed.";
    }

    if (event.error === "no-speech") {
        message = "No speech was detected. Please speak clearly.";
    }

    if (event.error === "network") {
        message = "Network error. Please check your internet connection.";
    }

    if (event.error === "language-not-supported") {
        message = `The selected language (${recognition.lang}) is not supported by this browser.`;
    }

    setStatus(message);
    responseText.textContent = message;

    micButton.textContent = "Wake Word";
    readyButton.textContent = "Ready to Listen";

  };

  recognition.onend = () => {
    isListening = false;

    if (wakeActivated) {
      setStatus('Assistant is active. Speak your command.');
      micButton.textContent = 'Assistant is active';
      readyButton.textContent = 'Listening';
      resetIdleTimer();
      return;
    }

    micButton.textContent = 'Listening for wake phrase';
    readyButton.textContent = 'Ready to Listen';
    setStatus('Waiting for wake phrase: HAY EVAN');
    setTimeout(() => {
      if (!isListening && isOnline() && recognition && isLanguageSelected()) {
        try { recognition.start(); } catch (error) {}
      }
    }, 400);
  };

  recognition.onresult = (event) => {
    // Assemble transcript from results
    let transcript = '';
    let anyFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcript += event.results[i][0].transcript + ' ';
      if (event.results[i].isFinal) anyFinal = true;
    }

    const normalized = normalizeText(transcript);
    if (!normalized) return;

    // update lastTranscript and reset silence timer
    lastTranscript = normalized;
    resetIdleTimer();

    if (speechSilenceTimer) clearTimeout(speechSilenceTimer);
    speechSilenceTimer = setTimeout(() => finalizeTranscript(), SILENCE_TIMEOUT_MS);

    // If any result isFinal, finalize immediately
    if (anyFinal) {
      if (speechSilenceTimer) {
        clearTimeout(speechSilenceTimer);
        speechSilenceTimer = null;
      }
      finalizeTranscript();
    }
  };

  // energy sampling helper
  function sampleEnergyFrame() {
    if (!analyserGlobal) return;
    const data = new Uint8Array(analyserGlobal.frequencyBinCount);
    analyserGlobal.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    const avg = sum / data.length;
    energyBuffer.push(avg);
    if (energyBuffer.length > ENERGY_BUFFER_MAX) energyBuffer.shift();

    // update noise floor as 20th percentile
    const sorted = energyBuffer.slice().sort((a, b) => a - b);
    const idx = Math.floor(sorted.length * 0.2);
    noiseFloor = sorted[idx] || noiseFloor || 0;

    // update last speech energy time if current frame is above noise margin
    // Use WAKE_PHRASE_MARGIN (lower threshold) if waiting for wake phrase to catch low voices
    const margin = wakeActivated ? SPEECH_ENERGY_MARGIN : WAKE_PHRASE_MARGIN;
    if (avg > Math.max(2, noiseFloor * margin)) {
      lastSpeechEnergyTime = Date.now();
    }

    // schedule next sample
    try { requestAnimationFrame(sampleEnergyFrame); } catch (e) {}
  }

  function finalizeTranscript() {
    if (processingLock) return;
    processingLock = true;

    const finalText = normalizeText(lastTranscript || '');
    if (!finalText) {
      processingLock = false;
      return;
    }

    // Check recent speech energy to avoid reacting to noise-only transcripts
    const now = Date.now();
    const spokeRecently = (now - lastSpeechEnergyTime) < Math.max(2000, SILENCE_TIMEOUT_MS + 500);
    if (analyserGlobal && !spokeRecently) {
      // no clear speech energy recently -> ignore
      processingLock = false;
      return;
    }

    // ignore very short transcripts (likely noise)
    const wordCount = finalText.split(/\s+/).filter(Boolean).length;
    if (wordCount < MIN_WORDS_FOR_COMMAND) {
      processingLock = false;
      return;
    }

    // Avoid processing the same or very similar final transcript repeatedly
    const nowTime = Date.now();
    if (finalText === lastProcessedTranscript) {
      if (nowTime - lastActionTime < ACTION_COOLDOWN_MS) {
        processingLock = false;
        return;
      }
    } else {
      // token-overlap similarity check
      const sim = tokenOverlapSimilarity(finalText, lastProcessedTranscript || '');
      if (sim >= 0.85 && (nowTime - lastActionTime) < ACTION_COOLDOWN_MS) {
        processingLock = false;
        return;
      }
    }

    lastProcessedTranscript = finalText;

    // If wake phrase wasn't active, look for wake phrase first
    // Use lower energy margin for wake phrase detection to catch low voices
    if (!wakeActivated && containsWakePhrase(finalText)) {
      // Require language selection before activating
      if (!isLanguageSelected()) {
        setStatus('Select your language choice to activate the assistant.');
        responseText.textContent = 'Select your language choice from the dropdown above.';
        processingLock = false;
        return;
      }

      const afterWake = stripWakePhrase(finalText);
      // Delay activation by 3 seconds to allow user to finish speaking
      setStatus('Wake phrase detected. Activating assistant in 3 seconds...');
      responseText.textContent = 'Wake phrase detected. Activating assistant...';
      micButton.textContent = 'Assistant is active';

      if (wakeActivationTimer) clearTimeout(wakeActivationTimer);
      wakeActivationTimer = setTimeout(() => {
        wakeActivated = true;
        setStatus('Listening for your command.');
        responseText.textContent = 'Assistant is active. Please say your command.';
        speakResponse('Assistant active. Please say your command.', languageSelect.value);
        resetSessionTimer();

        if (afterWake) {
          handleCommand(afterWake);
          lastActionTime = Date.now();
        }
      }, wakeActivationDelay);

      processingLock = false;
      return;
    }

    // If wake is active, treat finalText as command (strip any wake phrase)
    if (wakeActivated) {
      const commandText = normalizeText(stripWakePhrase(finalText));
      if (commandText && !containsWakePhrase(commandText)) {
        handleCommand(commandText);
        // After command, return to wake phrase listening
        // (handleCommand now resets state automatically)
        lastActionTime = Date.now();
      }
    }

    processingLock = false;
  }

  function resetSessionTimer() {
    if (sessionTimer) clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
      wakeActivated = false;
      setStatus('Session timed out. Say "HAY EVAN" or tap Ready to Listen to start again.');
      responseText.textContent = 'Session ended due to inactivity.';
      if (recognition && !isListening) {
        try { recognition.start(); } catch (e) {}
      }
    }, SESSION_TIMEOUT_MS);
  }

  // compute simple token-overlap similarity between two normalized transcripts
  function tokenOverlapSimilarity(a, b) {
    if (!a || !b) return 0;
    const as = a.split(/\s+/).filter(Boolean);
    const bs = b.split(/\s+/).filter(Boolean);
    if (!as.length || !bs.length) return 0;
    const aset = new Set(as);
    let inter = 0;
    for (const w of bs) if (aset.has(w)) inter++;
    return inter / Math.max(as.length, bs.length);
  }

  recognition.start();
}

micButton.addEventListener('click', startWakeListening);
readyButton.addEventListener('click', () => {
  // Require language selection
  if (!isLanguageSelected()) {
    setStatus('Please select a language before starting the assistant.');
    responseText.textContent = 'Please select a language first.';
    return;
  }

  if (!isOnline()) {
    setStatus('Internet connection is off. Please turn on mobile data or Wi‑Fi.');
    responseText.textContent = 'Internet connection is required to activate the assistant.';
    return;
  }

  const hasSpeechAPI = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  if (hasSpeechAPI) {
    wakeActivated = true;
    readyButton.textContent = 'Listening';
    micButton.textContent = 'Assistant is active';
    setStatus('Assistant is active. Speak your command.');
    responseText.textContent = 'Assistant is ready. Please speak your command.';
    speakResponse('Assistant ready. Please speak your command.', languageSelect.value);
    resetIdleTimer();
    return;
  }

  // Fallback: record audio and upload to server for transcription
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    readyButton.textContent = 'Ready to Listen';
    setStatus('Processing audio...');
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      // Use audio level monitoring to auto-stop on silence
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);

      // Pre-filter: highpass to remove rumble, lowpass to remove very high noise
      const hp = audioContext.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 120; // remove low-frequency rumble
      const lp = audioContext.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 6000; // speech band upper

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      // Connect chain: source -> hp -> lp -> analyser
      source.connect(hp);
      hp.connect(lp);
      lp.connect(analyser);

      // keep global analyser for other code
      analyserGlobal = analyser;
      audioContextGlobal = audioContext;
      startEnergySamplerOnce(audioContext.sampleRate);

      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        if (audioContext && audioContext.state !== 'closed') {
          try { audioContext.close(); } catch (e) {}
        }

        const blob = new Blob(recordedChunks, { type: 'audio/webm' });
        try {
          const result = await uploadAudioToServer(blob);
          if (result && result.text) {
            const t = result.text;
            responseText.textContent = t;
            const normalized = normalizeText(t);
            if (containsWakePhrase(normalized)) {
              const afterWake = stripWakePhrase(normalized);
              if (afterWake) handleCommand(afterWake);
              else {
                wakeActivated = true;
                setStatus('Wake phrase detected. Please say your command.');
                speakResponse('Assistant active. Please say your command.', languageSelect.value !== 'auto' ? languageSelect.value : 'en');
              }
            } else if (wakeActivated) {
              handleCommand(normalized);
            } else {
              handleCommand(normalized);
            }
          } else if (result && result.error) {
            setStatus(result.error);
            responseText.textContent = result.error;
          } else {
            setStatus('Transcription failed or not configured on server.');
            responseText.textContent = 'Transcription failed or server not configured.';
          }
        } catch (err) {
          setStatus('Upload failed: ' + (err.message || err));
          responseText.textContent = 'Upload failed: ' + (err.message || err);
        }
      };

      // before starting, sample short ambient noise using band energy
      const preSampleMs = 500;
      const preSamples = [];
      const preStart = Date.now();
      const preLoop = () => {
        const e = getBandEnergy(analyser, audioContext.sampleRate);
        preSamples.push(e);
        if (Date.now() - preStart < preSampleMs) requestAnimationFrame(preLoop);
        else {
          const sorted = preSamples.slice().sort((a, b) => a - b);
          const nf = sorted[Math.floor(sorted.length * 0.2)] || 0;
          const threshold = Math.max(6, nf * SPEECH_ENERGY_MARGIN);

          // Detection loop: wait for consecutive frames above threshold to start recording
          const VOICE_START_FRAMES = 3;
          let consecutiveAbove = 0;
          let started = false;
          let silenceStart = null;

          const detection = () => {
            const eNow = getBandEnergy(analyser, audioContext.sampleRate);
            if (!started) {
              if (eNow > threshold) {
                consecutiveAbove++;
              } else {
                consecutiveAbove = 0;
              }
              if (consecutiveAbove >= VOICE_START_FRAMES) {
                // start recording
                try { mediaRecorder.start(); } catch (err) {}
                started = true;
                readyButton.textContent = 'Recording...';
                setStatus('Recording detected. Speak now.');
              }
            } else {
              // already started: monitor silence to stop
              if (eNow < threshold) {
                if (silenceStart === null) silenceStart = Date.now();
                else if (Date.now() - silenceStart > SILENCE_TIMEOUT_MS) {
                  if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
                  return;
                }
              } else {
                silenceStart = null;
              }
            }

            requestAnimationFrame(detection);
          };

          requestAnimationFrame(detection);
        }
      };
      requestAnimationFrame(preLoop);
    })
    .catch((err) => {
      setStatus('Microphone permission denied or not available.');
      responseText.textContent = 'Microphone permission denied or not available.';
    });
});
stopButton.addEventListener('click', stopListening);

window.addEventListener('online', () => {
  setStatus('Connection restored. Say "HAY EVAN" or tap Ready to Listen.');
  if (!isListening) {
    startWakeListening();
  }
});

window.addEventListener('offline', () => {
  stopListening();
  setStatus('Connection lost. Please turn on your data connection.');
  responseText.textContent = 'The assistant is paused because internet connection is off.';
});

historyButton.addEventListener('click', () => {
  historyPanel.classList.toggle('hidden');
});

clearHistoryButton.addEventListener('click', () => {
  historyItems = [];
  showingAllHistory = false;
  renderHistory();
  saveHistory();
});

toggleHistoryButton.addEventListener('click', () => {
  if (historyItems.length <= 5) {
    return;
  }

  showingAllHistory = !showingAllHistory;
  renderHistory();
});

languageSelect.addEventListener('change', () => {
  const selectedLang = languageSelect.value;
  
  // Always update recognition language if a language is selected
  if (selectedLang && recognition) {
    recognition.lang = languageCodes[selectedLang] || 'ig-NG';
  }
  
  // Save the language preference to localStorage
  if (isLanguageSelected()) {
    saveLanguagePreference(selectedLang);
    setStatus('Language selected. Waiting for wake phrase: HAY EVAN');
    responseText.textContent = 'Language selected. Say "HAY EVAN" to activate the assistant.';
    
    // Only start listening if not currently active
    if (!wakeActivated && !isListening) {
      startWakeListening();
    }
  } else {
    // Language unselected: show welcome prompt
    setStatus('Please select a language to begin.');
    responseText.textContent = 'Welcome. Please select a language from the dropdown above to activate wake phrase';
    // Stop listening if active and language is unselected
    if (isListening) {
      stopListening();
    }
  }
});

loadHistory();
renderHistory();

// Load saved language preference from localStorage
const savedLanguage = loadLanguagePreference();
if (savedLanguage) {
  languageSelect.value = savedLanguage;
  if (recognition) {
    recognition.lang = languageCodes[savedLanguage] || 'ig-NG';
  }
}

// Initialize button states
micButton.textContent = 'Listening for wake phrase';
readyButton.textContent = 'Ready to Listen';

// Check if language is selected at startup
if (isLanguageSelected()) {
  const selectedLang = languageSelect.value;
  setStatus('Waiting for wake phrase: HAY EVAN');
  responseText.textContent = 'Language selected. Say "HAY EVAN" to activate the assistant.';
  // Automatically start listening if language was pre-loaded from localStorage
  startWakeListening();
} else {
  setStatus('Please select a language to begin.');
  responseText.textContent = 'Welcome. Please select a language from the dropdown above to activate wake phrase';
}

// Live clock update
const liveTimeEl = document.getElementById('liveTime');
function updateClock() {
  if (!liveTimeEl) return;
  const now = new Date();
  liveTimeEl.textContent = now.toLocaleTimeString();
}
updateClock();
setInterval(updateClock, 1000);
