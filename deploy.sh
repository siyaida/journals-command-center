#!/bin/bash
# deploy.sh — one-shot deploy script for command.siyada-cybersecurity.com
# Run from inside the cloned repo on the VPS.
#
# Usage:
#   1. Edit the variables below (DB_PASSWORD, Paperclip creds, JWT_SECRET)
#   2. chmod +x deploy.sh && ./deploy.sh

set -e

# ── EDIT THESE ──────────────────────────────────────────────────────────────
DB_PASSWORD="CHANGE_ME_strong_password_here"
# PAPERCLIP_API_URL: this container joins siyada-orchestrator_default network.
# 'localhost' inside a container refers to the container itself, NOT the host.
# Options:
#   - If Paperclip API is another service on that network: use its service name
#     e.g. PAPERCLIP_API_URL="http://api:3100"
#   - If Paperclip API runs on the VPS host: use host.docker.internal:3100
#     (works on Linux with --add-host=host.docker.internal:host-gateway in compose)
# Check your Paperclip docker-compose service names with: docker ps --format '{{.Names}}'
PAPERCLIP_API_URL="http://localhost:3100"
# PAPERCLIP_API_KEY: must be a long-lived API key, NOT a short-lived run JWT.
# Short-lived JWTs expire quickly and will cause 503 errors on all API routes.
# Get a permanent key from the Paperclip admin dashboard or CLI.
PAPERCLIP_API_KEY="your-paperclip-api-key"
PAPERCLIP_COMPANY_ID="your-company-id"
JWT_SECRET="$(openssl rand -hex 32)"
# ────────────────────────────────────────────────────────────────────────────

echo "==> Step 1: Setting up database..."
# Run setup SQL as the existing paperclip superuser
docker exec -i siyada-orchestrator-db-1 psql -U paperclip -c "
  CREATE DATABASE journals;
  CREATE USER journals_user WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';
  GRANT ALL PRIVILEGES ON DATABASE journals TO journals_user;
" || echo "(database/user may already exist — continuing)"

docker exec -i siyada-orchestrator-db-1 psql -U paperclip -d journals -c "
  GRANT ALL ON SCHEMA public TO journals_user;
"

echo "==> Step 2: Running schema migration..."
# Pipe migration SQL directly into the journals database
docker exec -i siyada-orchestrator-db-1 psql -U journals_user -d journals \
  < backend/src/db/migrations/001_initial.sql

echo "==> Step 3: Writing .env..."
cat > .env <<EOF
DB_PASSWORD=${DB_PASSWORD}
PAPERCLIP_API_URL=${PAPERCLIP_API_URL}
PAPERCLIP_API_KEY=${PAPERCLIP_API_KEY}
PAPERCLIP_COMPANY_ID=${PAPERCLIP_COMPANY_ID}
JWT_SECRET=${JWT_SECRET}
EOF
echo ".env written."

echo "==> Step 4: Building and starting the container..."
docker compose up -d --build

echo "==> Step 5: Installing Nginx config..."
sudo cp nginx/command.siyada-cybersecurity.com.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/command.siyada-cybersecurity.com.conf \
            /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

echo ""
echo "Done! Visit https://command.siyada-cybersecurity.com"
echo "Check logs: docker logs siyada-command-center"
