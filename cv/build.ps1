# Build cv/cv.tex -> etc/cv.pdf using Tectonic (same XeTeX/xdvipdfmx engine as the
# original template). Tectonic is a single self-contained binary; this script uses
# one on PATH if present, otherwise downloads it into cv/.tools (cached, gitignored).
#
# Usage:  pwsh cv/build.ps1   (or)   powershell -File cv/build.ps1

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root   = Split-Path -Parent $PSScriptRoot          # repo root
$tex    = Join-Path $root "cv\cv.tex"
$outPdf = Join-Path $root "cv\cv.pdf"
$tools  = Join-Path $root "cv\.tools"
$build  = Join-Path $root "cv\.tools\build"

# Resolve a tectonic executable.
$tectonic = (Get-Command tectonic -ErrorAction SilentlyContinue).Source
if (-not $tectonic) { $tectonic = Join-Path $tools "tectonic.exe" }
if (-not (Test-Path $tectonic)) {
    Write-Host "Tectonic not found - downloading standalone binary..."
    New-Item -ItemType Directory -Force -Path $tools | Out-Null
    $rel   = Invoke-RestMethod -Uri "https://api.github.com/repos/tectonic-typesetting/tectonic/releases/latest" -Headers @{ "User-Agent" = "cv-build" }
    $asset = $rel.assets | Where-Object { $_.name -match "x86_64-pc-windows-msvc\.zip$" } | Select-Object -First 1
    $zip   = Join-Path $tools $asset.name
    Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zip -Headers @{ "User-Agent" = "cv-build" }
    Expand-Archive -Path $zip -DestinationPath $tools -Force
    Remove-Item $zip
}

New-Item -ItemType Directory -Force -Path $build | Out-Null
& $tectonic $tex --outdir $build
if ($LASTEXITCODE -ne 0) { throw "tectonic failed (exit $LASTEXITCODE)" }

Copy-Item (Join-Path $build "cv.pdf") $outPdf -Force
Write-Host "Wrote $outPdf"
