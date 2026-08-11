# AI Political Navigator

An interactive app for exploring 21st-century politics through an interactive world map, country profiles, historical figures, and an AI assistant powered by Google Gemini.

## What it does

- **World map** — click a country to open its political profile
- **Country pages** — events grouped by category (foreign policy, economy, military, and more)
- **Historical figures** — biographies linked to countries and events
- **Smart links** — country and figure names in text are clickable
- **AI chat** — ask questions about what you are viewing
- **Quiz** — test your knowledge and earn XP

## Tech stack

| Layer | Tools |
|-------|-------|
| Backend | Python, FastAPI, Google Gemini |
| Frontend | React, Vite, React Simple Maps |
| Desktop (optional) | Electron |

## Prerequisites

- **Python 3.9+**
- **Node.js 16+**
- **Google Gemini API key** — create one at [Google AI Studio](https://aistudio.google.com/apikey)

## Quick start

### 1. Clone and open the project

```bash
git clone <your-repo-url>
cd "Folder name"
```

### 2. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
# source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux
```

Edit `backend/.env` and set your API key:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

Start the API:

```bash
python main.py
```

The backend runs at **http://localhost:8000**.

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

> The frontend proxies API calls to the backend automatically during development.

## Usage

1. **Home page** — use the map or search bar to find a country.
2. **Country page** — browse events by category; click highlighted countries or figures to navigate further.
3. **Event & figure pages** — read details and follow links between related topics.
4. **AI chat** — open the chat widget (bottom-right) to ask about the current page or any political topic.
5. **Quiz** — click **Quiz** in the header to answer questions and track your score.

### Desktop app (Windows, optional)

With the backend running, you can launch the Electron app instead of the browser:

```bash
# From the project root
START_DESKTOP_APP.bat
```

Or manually:

```bash
cd frontend
npm run electron:dev
```

## Configuration

| File | Purpose |
|------|---------|
| `backend/.env` | `GOOGLE_API_KEY`, `GEMINI_MODEL`, `BACKEND_URL` |
| `frontend/.env` | `VITE_API_URL` (default: `http://localhost:8000`) |

Copy from the `.env.example` files in each folder.

## API docs

With the backend running:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Note

Content is AI-assisted and intended for learning. Verify important facts with authoritative sources.
