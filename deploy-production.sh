#!/bin/bash

echo "🚀 Iniciando despliegue en producción..."

# Crear backup de archivos .env actuales
echo "📁 Creando backup de configuración actual..."
cp backend/.env backend/.env.backup 2>/dev/null || echo "No existe .env en backend"
cp frontend/.env frontend/.env.backup 2>/dev/null || echo "No existe .env en frontend"

# Crear archivos .env para producción
echo "⚙️  Configurando entorno de producción..."

# Backend .env para producción
cat > backend/.env << EOF
# Base de datos en servidor de producción
DB_USER=mquinones
DB_HOST=146.83.198.35
DB_NAME=repauto_bd
DB_PASSWORD=mquinones1211
DB_PORT=5432

# Configuración del servidor
JWT_SECRET=lksdf9234r0-9asdf!@#RLKJEFLKJ34lkj3423
PORT=80
NODE_ENV=production

# URL del frontend para CORS
FRONTEND_URL=http://146.83.198.35:1212
EOF

# Frontend .env para producción
cat > frontend/.env << EOF
VITE_API_URL=http://146.83.198.35:80/api
NODE_ENV=production
EOF

echo "✅ Archivos .env de producción creados"

# Construir frontend
echo "🏗️  Construyendo frontend..."
cd frontend
npm run build
cd ..

echo "🎉 Despliegue preparado para producción"
echo ""
echo "📋 Instrucciones para el servidor:"
echo "1. Backend: npm run prod (puerto 80)"
echo "2. Frontend: npm run start:prod (puerto 1212)"
echo ""
echo "🌐 URLs de acceso:"
echo "   - Frontend: http://146.83.198.35:1212"
echo "   - API: http://146.83.198.35:80/api"
echo "   - Health Check: http://146.83.198.35:80/api/health"
