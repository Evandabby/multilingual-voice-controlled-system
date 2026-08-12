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
  auto: 'Auto',
  ig: 'Igbo',
  yo: 'Yoruba',
  ha: 'Hausa',
  en: 'English'
};

const languageCodes = {
  en: 'en-US',
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

function executeAction(intent, text) {
  if (intent === 'UNKNOWN') {
    return { intent, status: 'unknown', message: responseCatalog.UNKNOWN.en };
  }

  const url = getActionUrl(intent);

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
        <strong>${item.language}</strong><br />
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
  historyItems.push({ command, language, result });
  renderHistory();
  saveHistory();
}

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem('evan_assistant_history') || '[]');
    if (Array.isArray(saved)) {
      historyItems = saved;
    }
  } catch (error) {
    historyItems = [];
  }
}

function speakResponse(text, languageKey) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  const selected = languageKey && languageKey !== 'auto' ? languageKey : (languageSelect.value !== 'auto' ? languageSelect.value : 'en');
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
  const cleanedText = normalizeText(text);
  if (!cleanedText) {
    return;
  }

  const selectedLanguage = languageSelect.value;
  const detectedLanguage = selectedLanguage === 'auto' ? detectLanguage(cleanedText) : selectedLanguage;
  const languageLabel = languageNames[detectedLanguage] || 'Auto';
  const intent = inferIntent(cleanedText);
  const action = executeAction(intent, cleanedText);
  const finalMessage = buildLocalizedMessage(intent, cleanedText, detectedLanguage, action);

  liveLanguage.textContent = `Language: ${languageLabel}`;
  responseText.textContent = finalMessage;
  setStatus(`Intent detected: ${intent}`);

  addHistory(cleanedText, languageLabel, finalMessage);
  speakResponse(finalMessage, detectedLanguage);
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
  micButton.textContent = 'Wake Word';
  readyButton.textContent = 'Ready to Listen';
  setStatus('Listening stopped. Say "HAY EVAN" or tap Ready to Listen to activate again.');
}

function startWakeListening() {
  if (!isOnline()) {
    setStatus('Internet connection is off. Please turn on mobile data or Wi‑Fi.');
    responseText.textContent = 'Internet connection is required to activate the assistant.';
    return;
  }

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    setStatus('Speech recognition is not supported in this browser.');
    responseText.textContent = 'Speech recognition is not supported in this browser.';
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = languageCodes[languageSelect.value] || 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    isListening = true;
    if (!wakeActivated) {
      setStatus('Waiting for wake phrase: HAY EVAN');
      micButton.textContent = 'Listening for wake word';
    } else {
      setStatus('Assistant is active. Speak your command.');
      micButton.textContent = 'Assistant Active';
      readyButton.textContent = 'Listening';
    }
    resetIdleTimer();
  };

  recognition.onerror = (event) => {
    isListening = false;
    setStatus(`Error: ${event.error}`);
    micButton.textContent = 'Wake Word';
    readyButton.textContent = 'Ready to Listen';
  };

  recognition.onend = () => {
    isListening = false;

    if (wakeActivated) {
      setStatus('Assistant is active. Speak your command.');
      micButton.textContent = 'Assistant Active';
      readyButton.textContent = 'Listening';
      resetIdleTimer();
      return;
    }

    micButton.textContent = 'Wake Word';
    readyButton.textContent = 'Ready to Listen';
    setStatus('Waiting for wake phrase: HAY EVAN');
    setTimeout(() => {
      if (!isListening && isOnline() && recognition) {
        try { recognition.start(); } catch (error) {}
      }
    }, 400);
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcript += event.results[i][0].transcript + ' ';
    }

    const finalText = normalizeText(transcript);
    if (!finalText) {
      return;
    }

    resetIdleTimer();

    if (!wakeActivated && containsWakePhrase(finalText)) {
      const afterWake = stripWakePhrase(finalText);
      wakeActivated = true;
      setStatus('Wake phrase detected. Listening for your command.');
      responseText.textContent = 'Wake phrase detected. Please say your command.';
      speakResponse('Assistant active. Please say your command.', languageSelect.value !== 'auto' ? languageSelect.value : 'en');

      if (afterWake) {
        handleCommand(afterWake);
      }
      return;
    }

    if (wakeActivated) {
      const commandText = normalizeText(stripWakePhrase(finalText));
      if (commandText && !containsWakePhrase(commandText)) {
        handleCommand(commandText);
      }
    }
  };

  recognition.start();
}

micButton.addEventListener('click', startWakeListening);
readyButton.addEventListener('click', () => {
  if (!isOnline()) {
    setStatus('Internet connection is off. Please turn on mobile data or Wi‑Fi.');
    responseText.textContent = 'Internet connection is required to activate the assistant.';
    return;
  }

  wakeActivated = true;
  readyButton.textContent = 'Listening';
  micButton.textContent = 'Assistant Active';
  setStatus('Assistant is active. Speak your command.');
  responseText.textContent = 'Assistant is ready. Please speak your command.';
  speakResponse('Assistant ready. Please speak your command.', languageSelect.value !== 'auto' ? languageSelect.value : 'en');
  resetIdleTimer();
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
  if (recognition) {
    recognition.lang = languageCodes[languageSelect.value] || 'en-US';
  }
});

loadHistory();
renderHistory();
setStatus('Waiting for wake phrase: HAY EVAN');
responseText.textContent = 'Welcome. Say "HAY EVAN" or tap Ready to Listen to activate the assistant.';
startWakeListening();
