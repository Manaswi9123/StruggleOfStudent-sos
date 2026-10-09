#!/usr/bin/env bash
# One-time setup on macOS / Linux / Git Bash:  bash setup.sh
set -euo pipefail
NODE_VERSION="22.22.0"

echo "1/4  Creating .venv with uv ..."
uv sync

echo "2/4  Installing Node.js $NODE_VERSION inside .venv (nodeenv) ..."
if [ ! -x ".venv/bin/node" ] && [ ! -f ".venv/Scripts/node.exe" ]; then
  uv run nodeenv -p --node="$NODE_VERSION"
fi

echo "3/4  Activating .venv ..."
if [ -f .venv/bin/activate ]; then source .venv/bin/activate; else source .venv/Scripts/activate; fi

echo "4/4  Installing JS dependencies with the venv's npm ..."
npm install

echo; echo "Done! Activate with 'source .venv/bin/activate' and run:  npm run dev"
