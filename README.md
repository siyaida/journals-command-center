# Journals & Command Center

Full-stack C-level journal and command center for Siyada Tech.

**Production URL:** https://command.siyada-cybersecurity.com

## Structure

```
├── frontend/       React + Vite + Tailwind
├── backend/        Node.js + Express (serves API + built frontend)
├── nginx/          Nginx server block config
├── Dockerfile      Multi-stage build (frontend → backend)
└── docker-compose.yml
```

## Deploy (VPS)

> VPS: 161.97.180.84 | Ubuntu 24.04 | Docker 29.3 | Nginx 1.24  
> Existing Postgres 17 in Docker network `siyada-orchestrator_default` (service: `db`)

### 1. One-time database setup

Connect to the existing Postgres container and run:

```bash
docker exec -it siyada-orchestrator-db-1 psql -U paperclip -f /path/to/000_setup.sql
docker exec -it siyada-orchestrator-db-1 psql -U journals_user -d journals -f /path/to/001_initial.sql
```

Or paste the SQL directly in a `psql` session. Replace `<PASSWORD>` in `000_setup.sql` first.

### 2. Clone and configure

```bash
git clone https://github.com/siyaida/journals-command-center.git
cd journals-command-center
cp backend/.env.example .env   # fill in DB_PASSWORD, Paperclip creds, JWT_SECRET
```

The `docker-compose.yml` reads from environment (or `.env` file in repo root).

### 3. Build and start

```bash
docker compose up -d --build
```

### 4. Nginx

```bash
sudo cp nginx/command.siyada-cybersecurity.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/command.siyada-cybersecurity.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
```

Visit https://command.siyada-cybersecurity.com

---

## Local Dev

```bash
# Build frontend once
cd frontend && npm install && npm run build && cd ..

# Backend (serves API + built frontend on http://localhost:3200)
cd backend && cp .env.example .env   # set DATABASE_URL to local Postgres
npm install && npm start
```

For frontend hot-reload:

```bash
# Terminal 1 — backend API
cd backend && npm run dev

# Terminal 2 — Vite dev server (proxies /api/* to localhost:3200)
cd frontend && npm run dev
```

---

## Environment Variables

| Variable             | Required | Description                                         |
| -------------------- | -------- | --------------------------------------------------- |
| `DB_PASSWORD`        | yes      | Password for `journals_user` in Postgres            |
| `PAPERCLIP_API_URL`  | yes      | Paperclip API base URL                              |
| `PAPERCLIP_API_KEY`  | yes      | Paperclip API key                                   |
| `PAPERCLIP_COMPANY_ID` | yes    | Paperclip company ID                                |
| `JWT_SECRET`         | yes      | Secret for JWT signing (Phase 3 auth)               |
| `PORT`               | no       | Default 3200                                        |
