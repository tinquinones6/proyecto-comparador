#!/bin/bash

echo "🚀 Building RepAuto Comparador for Production"
echo "============================================="

# Variables
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
DIST_DIR="dist"
SERVER_IP="146.83.198.35"
SERVER_PORT="1211"

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf $DIST_DIR
mkdir -p $DIST_DIR

# Build del Frontend
echo "🔨 Building Frontend..."
cd $FRONTEND_DIR

# Crear .env temporal para producción
echo "VITE_API_URL=http://$SERVER_IP:3000/api" > .env.production

# Build
npm run build

# Copiar dist al directorio principal
cp -r dist/* ../$DIST_DIR/

# Limpiar .env temporal
rm .env.production

cd ..

# Preparar Backend
echo "📦 Preparando Backend..."
cd $BACKEND_DIR

# Crear .env de ejemplo para producción
cat > .env.production.example << EOF
# Configuración para producción
PORT=3000
NODE_ENV=production

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=repauto_bd
DB_USER=mquinones
DB_PASSWORD=mquinones1211

# JWT Secret (cambiar por uno seguro)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024

# Frontend URL
FRONTEND_URL=http://$SERVER_IP:$SERVER_PORT
EOF

cd ..

echo "✅ Build completado!"
echo "📁 Archivos de producción en: ./$DIST_DIR/"
echo "🔧 Configurar .env en el servidor usando: $BACKEND_DIR/.env.production.example"
echo ""
echo "📋 Próximos pasos:"
echo "1. Copiar contenido de '$DIST_DIR/' al directorio de Apache"
echo "2. Copiar '$BACKEND_DIR/' al servidor"
echo "3. Configurar .env en el servidor"
echo "4. Instalar dependencias: npm install --production"
echo "5. Iniciar backend: npm start"
