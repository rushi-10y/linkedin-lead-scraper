Deployment guide
================

Frontend (Vercel)
- Configure a new Vercel project and set the Root Directory to `frontend`.
- Build Command: `npm run build`
- Output Directory: `dist`
- Alternatively enable the GitHub Action in `.github/workflows/deploy_frontend_vercel.yml` and set these repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Quick local deploy (CLI):
```bash
cd frontend
vercel login
vercel --prod
```

Backend (Recommendation)
- The backend requires long-running processes (Puppeteer), Python spawn, and a MongoDB connection — not ideal for Vercel serverless functions.
- Recommended hosts: Render, Railway, DigitalOcean App Platform, or a VPS.
- Example: Render web service. Set the root to `backend`, build/start commands per `backend/package.json`, and set environment variables from `config/config.env`.

Environment variables to set on the backend host:
- `MONGODB_URI`
- `PORT` (optional)
- `JWT_SECRET`
- `PYTHON_SCRAPER_PATH`
- `SCRAPING_API_KEY`

Notes
- The repo contains an `api` Express wrapper that references `backend` files; if deploying backend elsewhere, update API URLs in frontend/config accordingly.
- If you want, I can prepare a Render deployment template and add CI for backend.
