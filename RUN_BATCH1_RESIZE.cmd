@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\resize_batch1_icons.ps1" -ProjectRoot "%CD%"
echo.
pause
