#!/bin/bash

echo "🚀 Desplegando RepAuto Comparador - Configuración CORS correcta"
echo "=============================================================="

# Variables
SERVER_IP="146.83.198.35"
SERVER_USER="mquinones"
FRONTEND_PORT="443"
BACKEND_PORT="80"

echo "📦 Building Frontend para producción..."
cd frontend

# Crear build con configuración de producción
npm run build

cd ..

echo "📤 Desplegando al servidor..."

# Subir frontend
echo "🌐 Subiendo archivos del frontend..."
scp -r frontend/dist/* ${SERVER_USER}@${SERVER_IP}:/var/www/html/

# Subir backend
echo "⚙️ Subiendo archivos del backend..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p /home/${SERVER_USER}/repauto-backend"
scp -r backend/* ${SERVER_USER}@${SERVER_IP}:/home/${SERVER_USER}/repauto-backend/
scp ecosystem.config.json ${SERVER_USER}@${SERVER_IP}:/home/${SERVER_USER}/

# Instalar dependencias y reiniciar servicios
echo "🔧 Instalando dependencias y reiniciando servicios..."
ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
    cd /home/mquinones/repauto-backend
    npm install --production
    
    # Parar procesos existentes
    pm2 stop repauto-backend 2>/dev/null || true
    pm2 delete repauto-backend 2>/dev/null || true
    
    # Iniciar backend con PM2
    cd /home/mquinones
    pm2 start ecosystem.config.json
    pm2 save
    
    # Verificar que el puerto 443 esté libre
    sudo fuser -k 443/tcp 2>/dev/null || true
    
    # Cambiar al directorio del frontend
    cd /var/www/html
    
    # Iniciar frontend con vite preview en puerto 443
    nohup npx vite preview --port 443 --host 0.0.0.0 > /dev/null 2>&1 &
    
    echo "✅ Deployment completado!"
    echo "🌐 Frontend: http://146.83.198.35:443"
    echo "🔧 Backend: http://146.83.198.35:80"
    echo "❤️  Health: http://146.83.198.35:80/api/health"
EOF

echo "🎉 ¡Despliegue terminado!"
echo "📍 URLs de la aplicación:"
echo "   Frontend: http://${SERVER_IP}:${FRONTEND_PORT}"
echo "   Backend:  http://${SERVER_IP}:${BACKEND_PORT}/api"
echo "   Health:   http://${SERVER_IP}:${BACKEND_PORT}/api/health"
