# erpnext-lead-scraper

## Structure
```
erpnext-lead-scraper
├── frontend/linkedin-web-scraping/  (React UI)
├── scraper/ (Python Selenium)
├── scheduler/ (Cron jobs)
├── database/ (PyMongo)
├── api/ (Node API)
├── data/keywords.xlsx
├── config/config.env
└── logs/
```

## Setup
### One-command automation (recommended)

From the repo root:

- Install everything:
  - `npm install && npm run install:all`
  - `npm run py:install`
- Run everything (dev):
  - `npm run dev`

### One-localhost (single port) mode

If you want **only** `http://localhost:5000` (no separate frontend dev server port), run:

- Dev (watch build + backend serves `frontend/dist`):
  - `npm run dev:single`
- Prod-like (build once + backend serves `frontend/dist`):
  - `npm run start:single`

### Manual setup (if needed)
1. Backend: `cd backend && npm install && npm run dev`
2. API: `cd api && npm install && npm run dev`
3. Frontend: `cd frontend && npm install && npm run dev`
4. Python: `pip install -r requirements.txt`
5. Run scraper: `python scraper/leadScraper.py`
6. Scheduler: `python scheduler/cronScheduler.py`

## Integration
Node API calls Python via child_process.spawn('python', ['scraper/leadScraper.py', args])
