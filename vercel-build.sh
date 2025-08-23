#!/bin/bash

# Script de build para Vercel
echo "Instalando dependencias..."
npm install

echo "Configurando variables de entorno..."
export API_URL="https://api-portafolio.up.railway.app/api"

echo "Construyendo aplicación Angular en modo producción..."
npm run build

echo "Verificando configuración de build..."
if [ -f "dist/angular-portafolio/main.*.js" ]; then
    echo "✅ Build completado exitosamente"
    echo "🔍 Verificando que se use la URL correcta..."
    grep -r "api-portafolio.up.railway.app" dist/angular-portafolio/ || echo "⚠️  URL no encontrada en el build"
else
    echo "❌ Error en el build"
    exit 1
fi
