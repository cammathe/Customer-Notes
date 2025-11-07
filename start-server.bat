@echo off
REM Simple HTTP server for license-analyzer.html (Windows)
echo Starting local web server...
echo Open your browser to: http://localhost:8000/license-analyzer.html
echo Press Ctrl+C to stop the server
echo.

python -m http.server 8000
