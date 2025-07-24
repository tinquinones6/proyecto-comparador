#!/bin/bash

echo "🔄 Restaurando configuración de desarrollo..."

# Restaurar archivos .env de desarrollo
echo "⚙️  Configurando entorno de desarrollo..."

# Backend .env para desarrollo
cat > backend/.env << EOF
DB_USER=postgres
DB_HOST=localhost
DB_NAME=datos_scrapeados
DB_PASSWORD="852125"
DB_PORT=5432
JWT_SECRET=lksdf9234r0-9asdf!@#RLKJEFLKJ34lkj3423
PORT=3000
NODE_ENV=development
EOF

# Frontend .env para desarrollo (opcional - se usa la detección automática)
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development
EOF

echo "✅ Archivos .env de desarrollo restaurados"
echo ""
echo "📋 Instrucciones para desarrollo local:"
echo "1. Backend: npm run dev (puerto 3000)"
echo "2. Frontend: npm run dev (puerto 5173)"
echo ""
echo "🌐 URLs de desarrollo:"
echo "   - Frontend: http://localhost:5173"
echo "   - API: http://localhost:3000/api"
echo "   - Health Check: http://localhost:3000/api/health"
