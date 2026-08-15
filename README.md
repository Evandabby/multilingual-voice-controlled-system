# Multilingual Voice Controlled System

A polished web-based voice assistant prototype for Igbo, Yoruba, and Hausa commands. It features:

- Voice capture and transcript display
- Language selection and automatic language hints
- Intent detection for common app and web actions
- Text and speech feedback
- A professional, modern interface

## Run locally

Open index.html in a browser, or serve the folder with a lightweight static server.

Example:

python -m http.server 8000

## Why it may not work on GitHub Pages

GitHub Pages only hosts static front-end files (HTML/CSS/JS). Any backend code (for example server-side speech-to-text, audio upload endpoints, or long-running processes) will not run on GitHub Pages. If your assistant relied on a server endpoint for transcription or command processing, it must be deployed to a hosting service that supports a backend (see options below).

## Included server (optional)

This repo now contains a small Node/Express server at `server/server.js` which accepts audio uploads at `/stt` and forwards them to AssemblyAI for transcription when the `ASSEMBLYAI_API_KEY` environment variable is set.

Quick local run:

```bash
cd server
npm install
# create a .env file or export ASSEMBLYAI_API_KEY
npm start
```

If `ASSEMBLYAI_API_KEY` is not set the endpoint will return a helpful error explaining that STT is not configured.

## Deployment suggestions

- For a simple hosted backend use Railway.app or Render.com (both support Node/Express deployments and provide free tiers for hobby projects).
- For serverless functions, consider Vercel or Netlify functions; you'll need to adapt `server.js` into serverless handlers.
- After deploying the backend, host the frontend (this folder) on GitHub Pages or the same hosting provider, and point the client `fetch('/stt')` requests to the deployed server URL (or enable CORS as required).

How to point the frontend to a deployed backend

- In `index.html` set `window.BACKEND_ORIGIN` to your deployed server origin (example included in `index.html`). If empty, the client will use same-origin `/stt`.

Deploying to Railway (quick):

1. Create a GitHub repo and push this project.
2. Sign in to Railway and create a new project -> Deploy from GitHub -> select your repo.
3. Railway will detect Node and run `npm install` in `/server` if you configure the service to use `server` as the subdirectory; set the start command to `node server.js`.
4. Add an environment variable `ASSEMBLYAI_API_KEY` in Railway if you want server-side STT.
5. After deployment, copy the project URL and set `window.BACKEND_ORIGIN` in `index.html` to that URL (or host the frontend from the same domain).

Deploying to Render (quick):

1. Create a GitHub repo and push this project.
2. On Render, create a new Web Service and connect your GitHub repo. Set the root to `/server` (or provide a Dockerfile) and the start command to `node server.js`.
3. Add the `ASSEMBLYAI_API_KEY` environment variable in Render if required.
4. Use the public URL Render provides and set `window.BACKEND_ORIGIN` in `index.html` to that URL.

Notes about opening native apps on mobile

- A browser can open app deep-links (scheme URLs) only if the OS and app support them. The client will attempt known schemes and otherwise fall back to a web search.
- For robust native app control (launching installed apps directly and passing parameters) a small native wrapper app (Android/iOS) is necessary; browsers have limited capability for this.

## How this change helps

- The client uses the browser Web Speech API when available (desktop Chrome/Chromium). On mobile browsers that do not support the live Web Speech API, the app falls back to recording audio locally and sending it to the `/stt` endpoint for transcription.
- Because GitHub Pages does not run backend code, deploy the `server` directory to a backend-capable host to enable the fallback on other devices.
