# Script para usar Railway CLI con Docker
Write-Host "=== Railway CLI con Docker ===" -ForegroundColor Green
Write-Host ""

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Docker no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Mostrar opciones
Write-Host "=== Opciones disponibles ===" -ForegroundColor Cyan
Write-Host "1. Login a Railway" -ForegroundColor White
Write-Host "2. Conectar por SSH al proyecto" -ForegroundColor White
Write-Host "3. Ver proyectos" -ForegroundColor White
Write-Host "4. Salir" -ForegroundColor White
Write-Host ""

do {
    $opcion = Read-Host "Selecciona una opción (1-4)"

    switch ($opcion) {
        "1" {
            Write-Host "Ejecutando login de Railway..." -ForegroundColor Yellow
            Write-Host "Esto abrirá tu navegador para autenticarte" -ForegroundColor Cyan
            docker run --rm -it node:18-alpine sh -c "npm install -g @railway/cli@3.23.0 && railway login"
        }
        "2" {
            Write-Host "Conectando por SSH al proyecto..." -ForegroundColor Yellow
            Write-Host "Proyecto: 24bde0ba-ddaf-49ab-845d-717def4566fc" -ForegroundColor Cyan
            docker run --rm -it node:18-alpine sh -c "npm install -g @railway/cli@3.23.0 && railway ssh --project=24bde0ba-ddaf-49ab-845d-717def4566fc --environment=64ea8949-a9fc-4fba-8e2f-20d7d1f7fd32 --service=082d8970-1e42-4846-804c-569a2591792e"
        }
        "3" {
            Write-Host "Listando proyectos..." -ForegroundColor Yellow
            docker run --rm -it node:18-alpine sh -c "npm install -g @railway/cli@3.23.0 && railway projects"
        }
        "4" {
            Write-Host "Saliendo..." -ForegroundColor Yellow
            break
        }
        default {
            Write-Host "Opción inválida" -ForegroundColor Red
        }
    }

    if ($opcion -ne "4") {
        Write-Host ""
        Write-Host "Presiona Enter para continuar..."
        Read-Host
    }
} while ($opcion -ne "4")

Write-Host ""
Write-Host "Script terminado. Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
