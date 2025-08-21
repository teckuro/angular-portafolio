@echo off
echo ========================================
echo 🚀 Iniciando Servidores del Portafolio
echo ========================================

echo.
echo 📡 Iniciando servidor Laravel (API)...
start "Laravel API" cmd /k "cd api-portafolio && php artisan serve --host=127.0.0.1 --port=8000"

echo.
echo ⏳ Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Iniciando servidor Angular (Frontend)...
start "Angular Frontend" cmd /k "cd angular-portafolio && npm start"

echo.
echo ✅ Servidores iniciados correctamente!
echo.
echo 📍 URLs de acceso:
echo    - API Laravel: http://127.0.0.1:8000
echo    - Frontend Angular: http://localhost:4200
echo.
echo 🖼️ Sistema de upload de imágenes: FUNCIONANDO
echo.
pause
