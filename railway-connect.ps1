# Script para conectar a Railway SSH
# Autor: Asistente
# Fecha: 2025-08-22

Write-Host "=== Railway SSH Connection Script ===" -ForegroundColor Cyan
Write-Host ""

# Configurar alias para Railway CLI
Write-Host "Configurando Railway CLI..." -ForegroundColor Yellow
Set-Alias -Name railway -Value "C:\Users\PC\AppData\Roaming\npm\railway"

# Verificar si Railway CLI está disponible
Write-Host "Verificando Railway CLI..." -ForegroundColor Yellow
try {
    $version = railway --version 2>&1
    Write-Host "Railway CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "Error: Railway CLI no encontrado" -ForegroundColor Red
    Write-Host "Presiona cualquier tecla para salir..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""
Write-Host "=== Opciones disponibles ===" -ForegroundColor Cyan
Write-Host "1. Login a Railway" -ForegroundColor White
Write-Host "2. Conectar por SSH al proyecto" -ForegroundColor White
Write-Host "3. Ver proyectos disponibles" -ForegroundColor White
Write-Host "4. Salir" -ForegroundColor White
Write-Host ""

do {
    $opcion = Read-Host "Selecciona una opción (1-4)"

    switch ($opcion) {
        "1" {
            Write-Host "Ejecutando login de Railway..." -ForegroundColor Yellow
            Write-Host "Sigue las instrucciones en tu navegador para autenticarte" -ForegroundColor Cyan
            railway login
            Write-Host "Login completado" -ForegroundColor Green
        }
        "2" {
            Write-Host "Conectando por SSH al proyecto..." -ForegroundColor Yellow
            Write-Host "Proyecto: 24bde0ba-ddaf-49ab-845d-717def4566fc" -ForegroundColor Cyan
            Write-Host "Ambiente: 64ea8949-a9fc-4fba-8e2f-20d7d1f7fd32" -ForegroundColor Cyan
            Write-Host "Servicio: 082d8970-1e42-4846-804c-569a2591792e" -ForegroundColor Cyan
            Write-Host ""
            railway ssh --project=24bde0ba-ddaf-49ab-845d-717def4566fc --environment=64ea8949-a9fc-4fba-8e2f-20d7d1f7fd32 --service=082d8970-1e42-4846-804c-569a2591792e
        }
        "3" {
            Write-Host "Listando proyectos..." -ForegroundColor Yellow
            railway projects
        }
        "4" {
            Write-Host "Saliendo..." -ForegroundColor Yellow
            break
        }
        default {
            Write-Host "Opción inválida. Selecciona 1-4" -ForegroundColor Red
        }
    }

    if ($opcion -ne "4") {
        Write-Host ""
        Write-Host "Presiona Enter para continuar..."
        Read-Host
        Clear-Host
        Write-Host "=== Railway SSH Connection Script ===" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "=== Opciones disponibles ===" -ForegroundColor Cyan
        Write-Host "1. Login a Railway" -ForegroundColor White
        Write-Host "2. Conectar por SSH al proyecto" -ForegroundColor White
        Write-Host "3. Ver proyectos disponibles" -ForegroundColor White
        Write-Host "4. Salir" -ForegroundColor White
        Write-Host ""
    }
} while ($opcion -ne "4")

Write-Host "Script terminado. Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
