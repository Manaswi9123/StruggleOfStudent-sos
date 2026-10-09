# One-time setup on Windows (PowerShell). Run from the project folder:
#   powershell -ExecutionPolicy Bypass -File .\setup.ps1
$ErrorActionPreference = "Stop"
$NodeVersion = "22.22.0"

Write-Host "1/4  Creating .venv with uv ..." -ForegroundColor Cyan
uv sync

Write-Host "2/4  Installing Node.js $NodeVersion inside .venv (nodeenv) ..." -ForegroundColor Cyan
if (-not (Test-Path ".venv\Scripts\node.exe")) {
  uv run nodeenv -p --node=$NodeVersion
}

Write-Host "3/4  Activating .venv ..." -ForegroundColor Cyan
. .\.venv\Scripts\Activate.ps1

Write-Host "4/4  Installing JS dependencies with the venv's npm ..." -ForegroundColor Cyan
npm install

Write-Host "`nDone! Start the site with:  npm run dev" -ForegroundColor Green
