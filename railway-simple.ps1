# Script simple para Railway SSH
Write-Host "=== Railway SSH Connection ===" -ForegroundColor Green
Write-Host ""

# Configurar Railway CLI
Set-Alias -Name railway -Value "C:\Users\PC\AppData\Roaming\npm\railway"

Write-Host "1. Primero ejecuta: railway login" -ForegroundColor Yellow
Write-Host "2. Luego ejecuta el comando SSH" -ForegroundColor Yellow
Write-Host ""

Write-Host "Comando para login:" -ForegroundColor Cyan
Write-Host "railway login" -ForegroundColor White
Write-Host ""

Write-Host "Comando para SSH:" -ForegroundColor Cyan
Write-Host "railway ssh --project=24bde0ba-ddaf-49ab-845d-717def4566fc --environment=64ea8949-a9fc-4fba-8e2f-20d7d1f7fd32 --service=082d8970-1e42-4846-804c-569a2591792e" -ForegroundColor White
Write-Host ""

Write-Host "Presiona Enter para ejecutar login..."
Read-Host

Write-Host "Ejecutando login..." -ForegroundColor Yellow
railway login

Write-Host ""
Write-Host "Presiona Enter para ejecutar SSH..."
Read-Host

Write-Host "Ejecutando SSH..." -ForegroundColor Yellow
railway ssh --project=24bde0ba-ddaf-49ab-845d-717def4566fc --environment=64ea8949-a9fc-4fba-8e2f-20d7d1f7fd32 --service=082d8970-1e42-4846-804c-569a2591792e

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
