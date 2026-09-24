param (
    [switch]$Install
)

if ($Install) {
    Write-Host "Installing API dependencies..."
    cd apps\api
    pip install -r requirements.txt
    cd ..\..

    Write-Host "Installing Web dependencies..."
    cd apps\web
    npm install
    cd ..\..
}

Write-Host "Starting Docker containers (Postgres pgvector, Redis)..."
docker-compose up -d

Write-Host "Starting FastAPI backend..."
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn apps.api.main:app --reload --port 8000"

Write-Host "Starting Next.js frontend..."
cd apps\web
npm run dev
