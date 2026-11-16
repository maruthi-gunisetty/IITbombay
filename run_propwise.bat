@echo off
echo ========================================================
echo Starting PROPWISE AI Full-Stack Platform
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "PropWise AI - Backend" cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000"

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "PropWise AI - Frontend" cmd /k "cd frontend && npx vite --host 127.0.0.1 --port 5173"

echo.
echo ========================================================
echo Platform is launching!
echo - Web Application: http://localhost:5173
echo - API Documentation: http://localhost:8000/docs
echo ========================================================
timeout /t 3 >nul
start http://localhost:5173
