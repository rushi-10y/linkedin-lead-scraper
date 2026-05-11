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

## Single Port Dev (localhost:3000)

**Recommended:** Frontend dev server on :3001 (proxied), Backend APIs + UI proxy on :3000. Everything at **http://localhost:3000**.

```
npm run install:all
npm run dev
```

Frontend auto-proxies `/api` → backend:3000  
Backend auto-proxies UI → frontend:3001

### Legacy Modes (port 5000)
- Build+serve: `npm run dev:single` or `npm run start:single`

## Manual
1. Backend: `cd backend && npm i && npm run dev` (:3000)
2. Frontend: `cd frontend && npm i && npm run dev` (:3001)
3. Access: http://localhost:3000

## Integration
Node calls Python scraper via child_process.
