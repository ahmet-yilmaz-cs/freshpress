#!/usr/bin/env bash
# Bootstraps a venv, installs deps once, then runs the FreshPress API.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d .venv ]; then
  echo "→ Creating virtualenv..."
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate

if [ ! -f .venv/.deps-installed ] || [ requirements.txt -nt .venv/.deps-installed ]; then
  echo "→ Installing dependencies..."
  pip install --quiet --upgrade pip
  pip install --quiet -r requirements.txt
  touch .venv/.deps-installed
fi

export FLASK_APP=wsgi:app
PORT="${PORT:-5050}"
echo "→ FreshPress API on http://0.0.0.0:${PORT}"
exec python -m flask run --host 0.0.0.0 --port "${PORT}"
