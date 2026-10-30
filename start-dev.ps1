# Civic Infrastructure Memory - Development Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Civic Infrastructure Memory & Recurring Failure Intelligence" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Python
Write-Host "`n[1/3] Checking Python Backend Environment..." -ForegroundColor Yellow
python --version

# 2. Check Node
Write-Host "`n[2/3] Checking Node.js Frontend Environment..." -ForegroundColor Yellow
node --version
npm --version

# 3. Seed Demo Data into MongoDB (if available)
Write-Host "`n[3/3] Checking Data & Database..." -ForegroundColor Yellow
python backend/scripts/init_indexes.py
python backend/scripts/seed_demo_data.py

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "To run the application:" -ForegroundColor Green
Write-Host "Terminal 1 (Backend):  cd backend; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload" -ForegroundColor White
Write-Host "Terminal 2 (Frontend): cd frontend; npm run dev" -ForegroundColor White
Write-Host "API Documentation:     http://localhost:8000/docs" -ForegroundColor White
Write-Host "Frontend Portal:       http://localhost:5173" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
