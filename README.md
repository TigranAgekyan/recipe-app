# Simmer

**Turn YouTube cooking videos into clean, structured recipes.**

Paste a link, and Simmer pulls the transcript, has Claude extract the ingredients and steps, and saves a recipe you can actually cook from, complete with built-in step timers. It's my personal cookbook: installed on my iPhone as a web app and self-hosted on my home server.

A demo build runs on [tigranagekyan.com](https://tigranagekyan.com).

## Why

Cooking videos are great to watch and terrible to cook from. You end up scrubbing back and forth to catch "about a cup" while your hands are covered in flour. I wanted the recipe without the video around it, stored somewhere I own.

## Features

**Importing**
- Paste any YouTube link: watch, `youtu.be`, Shorts, embed or live URLs.
- Imports run in the background, with live progress. You can keep browsing, and imports started on another device show up too.
- Videos that aren't recipes are detected and rejected instead of producing junk.

**Cooking**
- **Step timers.** Steps with a real waiting time ("bake 25 minutes") get a one-tap timer. Timers keep running while you browse, stay visible in a floating dock, and ring with a chime and vibration, even on iOS.
- **Kitchen mode.** Keeps the screen awake while you cook.
- **Progress tracking.** Tick off ingredients and steps as you go. Your progress survives navigating away mid-cook and resets next time.
- **Clean ingredients.** Every ingredient is split into name, quantity, unit and note ("1 1/3 cups all-purpose flour" + "160g, sifted").

**App**
- Installable PWA that runs full-screen on iPhone like a native app.
- Warm, editorial design system (see [`design/`](./design)).

## How it works

```
 Paste URL ─→ FastAPI ─→ jobs table ─→ worker
                                         │
                       YouTube captions ─┤ (fallback: download audio → faster-whisper)
                                         ▼
                       Claude (forced tool call → validated schema)
                                         │
                                         ▼
                                  recipes table ─→ app
```

1. **Queue.** `POST /import` adds a job to Postgres and returns immediately (`202`). A background worker claims jobs with `FOR UPDATE SKIP LOCKED`, so a job can never be picked up twice, and jobs interrupted by a restart go back into the queue.
2. **Transcript.** The worker uses yt-dlp to fetch the video's title, description and captions. If there are no captions, or YouTube rate-limits the request, it downloads the audio and transcribes it locally with **faster-whisper** (CPU, int8). The model is unloaded after each job to keep memory low on the home server.
3. **Extraction.** The title, description and transcript go to **Claude**. The prompt forces a single `save_recipe` tool call whose input schema is generated from Pydantic models, so the response always comes back as valid, typed JSON. The rules are strict: never invent amounts, prefer exact amounts from the description, only add timers for real waiting times.
4. **Save.** The recipe is stored with its ingredients and steps as JSONB, and the job is marked done (or failed, with the error shown in the app).

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, PWA |
| Backend | Python 3.12, FastAPI, Uvicorn |
| Database | PostgreSQL 16 (psycopg 3, connection pool) |
| Transcription | yt-dlp, faster-whisper, FFmpeg |
| AI | Claude API (Anthropic SDK, tool use + Pydantic schemas) |
| Infrastructure | Docker Compose, self-hosted on Ubuntu Server, reached over Tailscale |

## Project structure

```
backend/
  app/
    main.py         REST API: recipes, imports, job status
    worker.py       background job queue
    transcribe.py   captions via yt-dlp, Whisper fallback
    structure.py    Claude extraction into a typed recipe schema
    db.py           Postgres connection pool
db/init.sql         schema: recipes and jobs
frontend/src/
  pages/            recipe list and recipe detail
  components/       import sheet, step timers, timer dock, kitchen mode…
  state/            recipes, imports and timers providers
  lib/              wake lock, alarm, storage, YouTube URL helpers
design/             design system and screen mockups
compose.yaml        db, backend, frontend and YouTube token provider
```

## API

| Method | Route | Description |
|---|---|---|
| `GET` | `/recipes` | List recipes, newest first |
| `GET` | `/recipes/{id}` | Full recipe with ingredients and steps |
| `POST` | `/import` | Queue a YouTube URL for import |
| `GET` | `/jobs` | Active imports plus failures from the last hour |
| `GET` | `/jobs/{id}` | Status of one import |
| `GET` | `/health` | Health check |

## Running it

Requirements: Docker with Compose, and an [Anthropic API key](https://console.anthropic.com).

1. Create a `.env` file in the project root:

   ```env
   POSTGRES_USER=simmer
   POSTGRES_PASSWORD=change-me
   POSTGRES_DB=simmer
   ANTHROPIC_API_KEY=your_api_key

   # Optional
   WHISPER_MODEL=small        # faster-whisper model size
   LLM_MODEL=claude-haiku-5-5 # Claude model used for extraction
   ```

2. Start everything:

   ```bash
   docker compose up -d --build
   ```

3. Open `http://localhost:8101`. The API runs on `http://localhost:8100`.

The first Whisper transcription downloads the model into `./models`, so it takes longer than later ones.

## Author

**Tigran Agekyan** · [tigranagekyan.com](https://tigranagekyan.com) · [LinkedIn](https://www.linkedin.com/in/tigran-agekyan)
