param(
    [string]$ProjectRoot = (Get-Location).Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
$backupParent = Join-Path $ProjectRoot ".folio-backups"

if (-not (Test-Path -LiteralPath $backupParent -PathType Container)) {
    throw "No .folio-backups folder was found in $ProjectRoot."
}

$latest = Get-ChildItem -LiteralPath $backupParent -Directory |
    Where-Object { $_.Name -like "batch1-icon-resize-*" } |
    Sort-Object Name -Descending |
    Select-Object -First 1

if ($null -eq $latest) {
    throw "No Batch 1 icon-resize backup was found."
}

$assetsRoot = Join-Path $latest.FullName "assets"

if (-not (Test-Path -LiteralPath $assetsRoot -PathType Container)) {
    throw "The latest backup does not contain an assets folder: $($latest.FullName)"
}

Copy-Item -Path (Join-Path $assetsRoot "*") -Destination (Join-Path $ProjectRoot "assets") -Recurse -Force

Write-Host ""
Write-Host "Restored the latest Batch 1 backup:" -ForegroundColor Green
Write-Host "  $($latest.FullName)"
Write-Host ""
Write-Host "Clear Metro's cache before checking the restored images:"
Write-Host "  npx expo start -c"
Write-Host ""
