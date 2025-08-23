#!/bin/bash

# Script de build para Vercel
echo "Instalando dependencias..."
npm install

echo "Construyendo aplicación Angular en modo producción..."
npm run build

echo "✅ Build completado exitosamente"
