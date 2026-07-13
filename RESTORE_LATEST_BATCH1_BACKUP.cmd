@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\restore_latest_batch1_backup.ps1" -ProjectRoot "%CD%"
echo.
pause
