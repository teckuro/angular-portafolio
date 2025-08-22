# Script de debug para Railway SSH
Write-Host "=== Railway Debug Script ===" -ForegroundColor Green
Write-Host "Fecha: $(Get-Date)" -ForegroundColor Gray
Write-Host ""

# Verificar Node.js
Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js no encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar npm
Write-Host "2. Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: npm no encontrado" -ForegroundColor Red
}

Write-Host ""

# Verificar Railway CLI
Write-Host "3. Verificando Railway CLI..." -ForegroundColor Yellow
$railwayPath = "C:\Users\PC\AppData\Roaming\npm\railway"
if (Test-Path $railwayPath) {
    Write-Host "Railway CLI encontrado en: $railwayPath" -ForegroundColor Green
} else {
    Write-Host "Error: Railway CLI no encontrado en $railwayPath" -ForegroundColor Red
}

Write-Host ""

# Configurar alias
Write-Host "4. Configurando alias..." -ForegroundColor Yellow
Set-Alias -Name railway -Value $railwayPath
Write-Host "Alias configurado" -ForegroundColor Green

Write-Host ""

# Intentar comando básico
Write-Host "5. Probando comando básico..." -ForegroundColor Yellow
try {
    $result = railway --version 2>&1
    Write-Host "Comando básico exitoso" -ForegroundColor Green
} catch {
    Write-Host "Error en comando básico: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Mostrar opciones
Write-Host "=== Opciones disponibles ===" -ForegroundColor Cyan
Write-Host "1. Hacer login a Railway" -ForegroundColor White
Write-Host "2. Verificar autenticación" -ForegroundColor White
Write-Host "3. Conectar por SSH" -ForegroundColor White
Write-Host "4. Salir" -ForegroundColor White
Write-Host ""

do {
    $opcion = Read-Host "Selecciona una opción (1-4)"

    switch ($opcion) {
        "1" {
            Write-Host "Ejecutando login..." -ForegroundColor Yellow
            Write-Host "Esto abrirá tu navegador para autenticarte" -ForegroundColor Cyan
            railway login
            Write-Host "Login completado" -ForegroundColor Green
        }
        "2" {
            Write-Host "Verificando autenticación..." -ForegroundColor Yellow
            railway whoami
        }
        "3" {
            Write-Host "Conectando por SSH..." -ForegroundColor Yellow
            Write-Host "Proyecto: 24bde0ba-ddaf-49ab-845d-717def4566fc" -ForegroundColor Cyan
            railway ssh --project=24bde0ba-ddaf-49ab-845d-717def4566fc --environment=64ea8949-a9fc-4fba-8e2f-20d7d1f7fd32 --service=082d8970-1e42-4846-804c-569a2591792e
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
