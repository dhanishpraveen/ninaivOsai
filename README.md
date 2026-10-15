# தமிழ் மரபு (Tamil Heritage) - Digital Preservation of Tamil Oral History

> **TAMIZH HACK FEST 2026** • **Problem Statement P4: Digital Preservation of Tamil Oral History**  
> Preserving the voices, folklore, artisanal wisdom, and agricultural memories of Tamil elders through voice transcription and cultural knowledge retrieval.

---

## Architecture & Technology Stack

- **Frontend**: React (Vite), JavaScript, Tailwind CSS, React Router, Lucide React icons.
- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic, Python-Dotenv.
- **Speech-to-Text (Planned - Phase 3)**: Hugging Face `vasista22/whisper-tamil-small`.
- **Database & Storage (Planned - Phase 6)**: Supabase Audio Storage & PostgreSQL tables.
- **Heritage AI (Planned - Phase 8)**: Evidence-grounded Tamil conversational agent with source citations.

---

## Phase 1 Status: Project Foundation & UI Shell

Phase 1 establishes the complete modular foundation without simulated operations or fake backend calls:

1. **Landing Page (`/`)**: Product showcase, Tamil cultural context, "Preserve a Story" & "Explore Archive" CTAs, core feature pillars, and 4-step workflow.
2. **Dashboard (`/dashboard`)**: Key metrics (Preserved Stories, Hours Recorded, Regions), quick actions, and curated recent oral narratives with explicit demo labeling.
3. **Preserve a Story (`/preserve`)**: Dual-mode input (file upload & browser recording layout), full oral metadata schema (title, narrator, region, dialect, category, description), and mandatory community consent confirmation.
4. **Story Archive (`/archive`)**: Live search, dual-filter controls (region and category), responsive story cards, and full-detail narrative preview modal.
5. **Ask Heritage AI (`/ask-ai`)**: Chat interface, suggested cultural research questions, dual-panel source citation design, and transparent insufficient-evidence policy.
6. **Settings (`/settings`)**: Contributor profile, dual-language preferences, and pipeline architecture status monitor.
7. **FastAPI Backend (`/backend`)**: Minimal server with CORS configured for Vite dev server, health endpoint (`GET /health`), and automated test suite.

---

## Directory Structure

```
ninaivosai/
├── frontend/                  # React + Vite + Tailwind application
│   ├── src/
│   │   ├── components/        # Layout, Sidebar, Navbar, StoryCard, Badge
│   │   ├── pages/             # Landing, Dashboard, Preserve, Archive, Ask AI, Settings
│   │   ├── data/              # Curated Tamil oral history sample records
│   │   ├── App.jsx            # React Router definitions
│   │   ├── main.jsx           # Application entry point with BrowserRouter
│   │   └── index.css          # Tailwind design tokens and custom styles
│   ├── tailwind.config.js     # Warm ivory, deep maroon, and gold palette
│   ├── postcss.config.js
│   └── package.json
├── backend/                   # Python FastAPI service
│   ├── main.py                # FastAPI app with CORS & GET /health
│   ├── test_health.py         # Automated health verification test
│   ├── requirements.txt       # Backend dependencies
│   └── .env.example           # Environment template
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24.16.0)
- **Python**: 3.10+ (tested on 3.11.9)

---

### 2. Backend Setup & Run

Navigate to the `backend/` directory:

```bash
cd backend
python -m pip install -r requirements.txt
```

Run the FastAPI server:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

Verify backend health:
- Browser or curl: `http://127.0.0.1:8001/health`
- Expected response:
  ```json
  {
    "status": "ok",
    "phase": "Phase 1: Project Foundation and UI Shell",
    "app": "Tamil Heritage Preservation",
    "version": "1.0.0",
    "message": "Backend service is healthy and CORS configured."
  }
  ```

Run automated backend tests:
```bash
python test_health.py
```

---

### 3. Frontend Setup & Run

In a separate terminal, navigate to the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To verify a production build:
```bash
npm run build
```

---

## 10-Phase Hackathon Roadmap

- [x] **Phase 1**: Project foundation, layout system, and responsive UI shell.
- [ ] **Phase 2**: In-browser audio recording (MediaRecorder) and audio file upload.
- [ ] **Phase 3**: FastAPI backend and Hugging Face Tamil speech-to-text (`vasista22/whisper-tamil-small`).
- [ ] **Phase 4**: Transcript review, editing, and timestamp alignment.
- [ ] **Phase 5**: AI-generated titles, summaries, keywords, and dialect tags.
- [ ] **Phase 6**: Supabase database tables and audio cloud storage integration.
- [ ] **Phase 7**: Story archive search, filtering, and audio playback.
- [ ] **Phase 8**: Tamil Heritage Knowledge Agent with source evidence citations.
- [ ] **Phase 9**: End-to-end integration, error handling, and security auditing.
- [ ] **Phase 10**: Final polish, mobile responsiveness audit, and live demo presentation prep.
