@echo off
echo ========================================
echo    INICIANDO FRONTEND ANGULAR
echo ========================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no encontrado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado ✓

REM Verificar Angular CLI
ng version >nul 2>&1
if errorlevel 1 (
    echo Instalando Angular CLI...
    npm install -g @angular/cli
    if errorlevel 1 (
        echo ERROR: Fallo al instalar Angular CLI
        pause
        exit /b 1
    )
)

echo Angular CLI encontrado ✓

REM Verificar dependencias
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ERROR: Fallo al instalar dependencias
        pause
        exit /b 1
    )
)

echo Dependencias instaladas ✓

REM Limpiar puerto 4200 si está ocupado
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do taskkill /f /pid %%a >nul 2>&1

echo.
echo Iniciando servidor Angular...

REM Iniciar Angular en background
start /B "Angular Frontend" ng serve --open

REM Esperar un momento
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo    FRONTEND INICIADO
echo ========================================
echo.
echo Frontend: http://localhost:4200
echo Backend API: http://127.0.0.1:8000/api
echo.
echo Para detener: Ctrl+C en la ventana del servidor
echo ========================================
