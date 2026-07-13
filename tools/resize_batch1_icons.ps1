param(
    [string]$ProjectRoot = (Get-Location).Path,
    [switch]$SkipBackup
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$ProjectRoot = [System.IO.Path]::GetFullPath($ProjectRoot)

$Targets = @(
    [PSCustomObject]@{
        Path = "assets\folio-ui\home-page\home_review_icon.png"
        MaxWidth = 192
        MaxHeight = 192
    },
    [PSCustomObject]@{
        Path = "assets\folio-ui\home-page\home_notes_icon.png"
        MaxWidth = 192
        MaxHeight = 192
    },
    [PSCustomObject]@{
        Path = "assets\folio-ui\home-page\home_arrow_icon.png"
        MaxWidth = 96
        MaxHeight = 96
    },
    [PSCustomObject]@{
        Path = "assets\folio-ui\home-page\create-card\create_card_deck_stack.png"
        MaxWidth = 128
        MaxHeight = 128
    },
    [PSCustomObject]@{
        Path = "assets\folio-ui\home-page\create-card\create_card_front_a.png"
        MaxWidth = 128
        MaxHeight = 128
    },
    [PSCustomObject]@{
        Path = "assets\folio-ui\home-page\create-card\create_card_back_b.png"
        MaxWidth = 128
        MaxHeight = 128
    },
    [PSCustomObject]@{
        Path = "assets\folio-ui\home-page\create-card\create_card_add_stack.png"
        MaxWidth = 128
        MaxHeight = 112
    }
)

function Get-PngInfo {
    param([Parameter(Mandatory = $true)][string]$Path)

    $stream = [System.IO.File]::Open(
        $Path,
        [System.IO.FileMode]::Open,
        [System.IO.FileAccess]::Read,
        [System.IO.FileShare]::Read
    )

    try {
        $image = [System.Drawing.Image]::FromStream($stream, $true, $true)
        try {
            return [PSCustomObject]@{
                Width = $image.Width
                Height = $image.Height
                PixelFormat = $image.PixelFormat.ToString()
                FileBytes = (Get-Item -LiteralPath $Path).Length
            }
        }
        finally {
            $image.Dispose()
        }
    }
    finally {
        $stream.Dispose()
    }
}

function Resize-Png {
    param(
        [Parameter(Mandatory = $true)][string]$SourcePath,
        [Parameter(Mandatory = $true)][int]$MaxWidth,
        [Parameter(Mandatory = $true)][int]$MaxHeight
    )

    $sourceStream = [System.IO.File]::Open(
        $SourcePath,
        [System.IO.FileMode]::Open,
        [System.IO.FileAccess]::Read,
        [System.IO.FileShare]::Read
    )

    try {
        $source = [System.Drawing.Image]::FromStream($sourceStream, $true, $true)

        try {
            $scaleX = $MaxWidth / [double]$source.Width
            $scaleY = $MaxHeight / [double]$source.Height
            $scale = [Math]::Min(1.0, [Math]::Min($scaleX, $scaleY))

            $newWidth = [Math]::Max(1, [int][Math]::Round($source.Width * $scale))
            $newHeight = [Math]::Max(1, [int][Math]::Round($source.Height * $scale))

            if ($newWidth -eq $source.Width -and $newHeight -eq $source.Height) {
                return [PSCustomObject]@{
                    Width = $newWidth
                    Height = $newHeight
                    Changed = $false
                }
            }

            $bitmap = New-Object System.Drawing.Bitmap -ArgumentList @(
                $newWidth,
                $newHeight,
                [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
            )

            try {
                $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

                try {
                    $graphics.Clear([System.Drawing.Color]::Transparent)
                    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
                    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

                    $attributes = New-Object System.Drawing.Imaging.ImageAttributes

                    try {
                        $attributes.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)

                        $destination = New-Object System.Drawing.Rectangle -ArgumentList @(0, 0, $newWidth, $newHeight)
                        $graphics.DrawImage(
                            $source,
                            $destination,
                            0,
                            0,
                            $source.Width,
                            $source.Height,
                            [System.Drawing.GraphicsUnit]::Pixel,
                            $attributes
                        )
                    }
                    finally {
                        $attributes.Dispose()
                    }
                }
                finally {
                    $graphics.Dispose()
                }

                $temporaryPath = "$SourcePath.folio-resize.tmp.png"
                $bitmap.Save($temporaryPath, [System.Drawing.Imaging.ImageFormat]::Png)

                try {
                    $verification = Get-PngInfo -Path $temporaryPath

                    if ($verification.Width -ne $newWidth -or $verification.Height -ne $newHeight) {
                        throw "Verification failed for $SourcePath."
                    }

                    # Copy the verified temporary PNG over the existing file.
                    # System.IO.File.Copy with overwrite enabled is reliable on
                    # Windows PowerShell after all image streams are disposed.
                    [System.IO.File]::Copy($temporaryPath, $SourcePath, $true)
                    [System.IO.File]::Delete($temporaryPath)
                }
                finally {
                    if (Test-Path -LiteralPath $temporaryPath) {
                        Remove-Item -LiteralPath $temporaryPath -Force
                    }
                }
            }
            finally {
                $bitmap.Dispose()
            }

            return [PSCustomObject]@{
                Width = $newWidth
                Height = $newHeight
                Changed = $true
            }
        }
        finally {
            $source.Dispose()
        }
    }
    finally {
        $sourceStream.Dispose()
    }
}

Write-Host ""
Write-Host "Folio Batch 1 icon resize" -ForegroundColor Cyan
Write-Host "Project root: $ProjectRoot"
Write-Host ""

$Missing = @()

foreach ($target in $Targets) {
    $fullPath = Join-Path $ProjectRoot $target.Path

    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $Missing += $target.Path
    }
}

if ($Missing.Count -gt 0) {
    Write-Host "Nothing was changed. These required files were not found:" -ForegroundColor Red

    foreach ($path in $Missing) {
        Write-Host "  - $path" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "Extract this utility into the actual Folio project root and run it again."
    exit 1
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $ProjectRoot ".folio-backups\batch1-icon-resize-$timestamp"

if (-not $SkipBackup) {
    foreach ($target in $Targets) {
        $sourcePath = Join-Path $ProjectRoot $target.Path
        $backupPath = Join-Path $backupRoot $target.Path
        $backupDirectory = Split-Path -Parent $backupPath

        New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null
        Copy-Item -LiteralPath $sourcePath -Destination $backupPath -Force
    }

    Write-Host "Backup created:" -ForegroundColor Green
    Write-Host "  $backupRoot"
    Write-Host ""
}

$report = @()

foreach ($target in $Targets) {
    $fullPath = Join-Path $ProjectRoot $target.Path
    $before = Get-PngInfo -Path $fullPath
    $result = Resize-Png -SourcePath $fullPath -MaxWidth $target.MaxWidth -MaxHeight $target.MaxHeight
    $after = Get-PngInfo -Path $fullPath

    $savedBytes = $before.FileBytes - $after.FileBytes
    $savedPercent = if ($before.FileBytes -gt 0) {
        [Math]::Round(($savedBytes / [double]$before.FileBytes) * 100, 1)
    }
    else {
        0
    }

    $report += [PSCustomObject]@{
        Path = $target.Path
        BeforeWidth = $before.Width
        BeforeHeight = $before.Height
        AfterWidth = $after.Width
        AfterHeight = $after.Height
        BeforeBytes = $before.FileBytes
        AfterBytes = $after.FileBytes
        SavedBytes = $savedBytes
        SavedPercent = $savedPercent
        PixelFormat = $after.PixelFormat
        Changed = $result.Changed
    }
}

if (-not $SkipBackup) {
    $reportPath = Join-Path $backupRoot "batch1-resize-report.json"
    $report | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $reportPath -Encoding UTF8
}

Write-Host "Resize results:" -ForegroundColor Cyan
$report |
    Select-Object Path,
        @{ Name = "Before"; Expression = { "$($_.BeforeWidth)x$($_.BeforeHeight)" } },
        @{ Name = "After"; Expression = { "$($_.AfterWidth)x$($_.AfterHeight)" } },
        @{ Name = "Saved"; Expression = { "$($_.SavedPercent)%" } } |
    Format-Table -AutoSize

$totalBefore = ($report | Measure-Object -Property BeforeBytes -Sum).Sum
$totalAfter = ($report | Measure-Object -Property AfterBytes -Sum).Sum
$totalSavedPercent = if ($totalBefore -gt 0) {
    [Math]::Round((($totalBefore - $totalAfter) / [double]$totalBefore) * 100, 1)
}
else {
    0
}

Write-Host ""
Write-Host "Batch 1 complete." -ForegroundColor Green
Write-Host "Disk-size reduction across these files: $totalSavedPercent%"
Write-Host ""
Write-Host "Next, clear Metro's image cache before judging the result:" -ForegroundColor Yellow
Write-Host "  npx expo start -c"
Write-Host ""
