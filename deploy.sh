#!/usr/bin/env bash
# Deploy: git pull → install → build → PM2 reload (or first start).
# Run from the server repo clone, e.g. ./deploy.sh
#
# Optional env overrides:
#   GIT_REMOTE=origin GIT_BRANCH=main   — pull a specific branch (default: tracked branch)
#   PORT=3001                           — listen port (default: 4321)
#
# To rename the process, change "name" in ecosystem.config.cjs and the PM2_NAME below.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

GIT_REMOTE="${GIT_REMOTE:-origin}"
GIT_BRANCH="${GIT_BRANCH:-}"
PM2_NAME='mef-website'
export PORT="${PORT:-4321}"
export NODE_ENV=production

for cmd in git pnpm pm2; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "error: required command not found: $cmd" >&2
    exit 1
  }
done

echo "==> Git pull"
if [[ -n "$GIT_BRANCH" ]]; then
  git fetch "$GIT_REMOTE" "$GIT_BRANCH"
  git pull --ff-only "$GIT_REMOTE" "$GIT_BRANCH"
else
  git pull --ff-only
fi

echo "==> Dependencies (pnpm install --frozen-lockfile)"
pnpm install --frozen-lockfile

echo "==> Build"
pnpm run build

echo "==> PM2 ($PM2_NAME, PORT=$PORT)"
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --env production --only "$PM2_NAME" --update-env
else
  pm2 start ecosystem.config.cjs --env production --only "$PM2_NAME" --update-env
fi

pm2 save

echo "==> Done: $PM2_NAME listening on port $PORT"
