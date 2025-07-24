#!/bin/bash

echo "🚀 Deploying RepAuto Comparador to Production Server"
echo "=================================================="

# Variables
SERVER_IP="146.83.198.35"
SERVER_USER="mquinones"
FRONTEND_PORT="443"
BACKEND_PORT="80"

echo "📦 Building Frontend..."
cd frontend
npm run build
cd ..

echo "📤 Deploying to server..."

# Subir frontend
echo "🌐 Uploading frontend files..."
scp -r frontend/dist/* ${SERVER_USER}@${SERVER_IP}:/var/www/html/

# Subir backend
echo "⚙️ Uploading backend files..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p /home/${SERVER_USER}/repauto-backend"
scp -r backend/* ${SERVER_USER}@${SERVER_IP}:/home/${SERVER_USER}/repauto-backend/
scp ecosystem.config.json ${SERVER_USER}@${SERVER_IP}:/home/${SERVER_USER}/

# Instalar dependencias y reiniciar servicios
echo "🔧 Installing dependencies and restarting services..."
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
    
    # Verificar que el puerto 80 esté libre y iniciar frontend
    sudo fuser -k 443/tcp 2>/dev/null || true
    
    cd /var/www/html
    # Iniciar frontend con vite preview en puerto 443
    nohup npx vite preview --port 443 --host 0.0.0.0 > /dev/null 2>&1 &
    
    echo "✅ Deployment completed!"
    echo "🌐 Frontend: http://146.83.198.35:443"
    echo "🔧 Backend: http://146.83.198.35:80"
EOF

echo "🎉 Deployment finished!"
echo "📍 Application URLs:"
echo "   Frontend: http://${SERVER_IP}:${FRONTEND_PORT}"
echo "   Backend:  http://${SERVER_IP}:${BACKEND_PORT}/api"
echo "   Health:   http://${SERVER_IP}:${BACKEND_PORT}/api/health"
