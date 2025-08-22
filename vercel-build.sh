#!/bin/bash

# Script de build para Vercel
echo "Instalando dependencias..."
npm install

echo "Construyendo aplicación Angular..."
npm run build

echo "Build completado exitosamente"
