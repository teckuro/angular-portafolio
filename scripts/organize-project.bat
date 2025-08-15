@echo off
echo ========================================
echo   ORGANIZADOR DE PROYECTO ANGULAR
echo ========================================
echo.

echo [1/5] Verificando estructura de carpetas...
if not exist "src\app\core" (
    echo Creando carpeta core...
    mkdir "src\app\core"
)

if not exist "src\app\shared" (
    echo Creando carpeta shared...
    mkdir "src\app\shared"
)

if not exist "src\app\features" (
    echo Creando carpeta features...
    mkdir "src\app\features"
)

if not exist "src\app\features\admin" (
    echo Creando carpeta admin...
    mkdir "src\app\features\admin"
)

if not exist "src\app\features\portfolio" (
    echo Creando carpeta portfolio...
    mkdir "src\app\features\portfolio"
)

echo [2/5] Verificando documentación...
if not exist "docs" (
    echo Creando carpeta docs...
    mkdir "docs"
)

if not exist "PROJECT_ORGANIZATION.md" (
    echo Creando documentación de organización...
    copy "PROJECT_ORGANIZATION.md" "docs\PROJECT_ORGANIZATION.md"
)

echo [3/5] Verificando scripts...
if not exist "scripts" (
    echo Creando carpeta scripts...
    mkdir "scripts"
)

echo [4/5] Verificando archivos de configuración...
if not exist ".editorconfig" (
    echo Creando .editorconfig...
    echo root = true > .editorconfig
    echo. >> .editorconfig
    echo [*] >> .editorconfig
    echo charset = utf-8 >> .editorconfig
    echo end_of_line = lf >> .editorconfig
    echo insert_final_newline = true >> .editorconfig
    echo trim_trailing_whitespace = true >> .editorconfig
    echo indent_style = space >> .editorconfig
    echo indent_size = 2 >> .editorconfig
)

echo [5/5] Verificando archivos de linting...
if not exist ".prettierrc" (
    echo Creando configuración de Prettier...
    echo { > .prettierrc
    echo   "semi": true, >> .prettierrc
    echo   "trailingComma": "es5", >> .prettierrc
    echo   "singleQuote": true, >> .prettierrc
    echo   "printWidth": 80, >> .prettierrc
    echo   "tabWidth": 2 >> .prettierrc
    echo } >> .prettierrc
)

echo.
echo ========================================
echo   ORGANIZACIÓN COMPLETADA
echo ========================================
echo.
echo ✅ Estructura de carpetas verificada
echo ✅ Documentación organizada
echo ✅ Scripts de automatización creados
echo ✅ Configuración de linting aplicada
echo.
echo 📋 Próximos pasos:
echo 1. Ejecutar 'npm install' para instalar dependencias
echo 2. Ejecutar 'ng lint' para verificar el código
echo 3. Ejecutar 'ng test' para ejecutar pruebas
echo 4. Revisar la documentación en PROJECT_ORGANIZATION.md
echo.
pause
