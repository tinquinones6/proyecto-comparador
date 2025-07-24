# Configuración CORS - Guía de Resolución

## Problema identificado
- Frontend corriendo en puerto 1212: `http://146.83.198.35:1212`
- Backend corriendo en puerto 3000: `http://146.83.198.35:3000`
- Error CORS: `Access-Control-Allow-Origin` no puede ser wildcard (*) cuando se usa `withCredentials: true`

## Soluciones implementadas

### 1. Backend (Node.js/Express)
- ✅ Agregado puerto 1212 a orígenes permitidos
- ✅ Configuración CORS específica por origen (no wildcard)
- ✅ Headers CORS manuales para mejor compatibilidad
- ✅ Manejo de preflight OPTIONS requests

### 2. Configuración Apache recomendada
Agregar al VirtualHost o .htaccess:

```apache
# Habilitar módulo headers si no está activo
# a2enmod headers

# Configuración CORS para el backend (puerto 3000)
<Location "/api">
    Header always set Access-Control-Allow-Origin "http://146.83.198.35:1212"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Expose-Headers "Authorization"
    
    # Manejar preflight requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</Location>

# Para el frontend (puerto 1212)
<VirtualHost *:1212>
    # Tu configuración del frontend aquí
    DocumentRoot /ruta/a/tu/frontend/dist
    
    # Configuración para SPA (Single Page Application)
    <Directory "/ruta/a/tu/frontend/dist">
        AllowOverride All
        Require all granted
        
        # Redirigir todas las rutas a index.html para SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>

# Para el backend (puerto 3000)
<VirtualHost *:3000>
    # Proxy al backend Node.js
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    # Configuración CORS
    ProxyPreserveHost On
    Header always set Access-Control-Allow-Origin "http://146.83.198.35:1212"
    Header always set Access-Control-Allow-Credentials "true"
</VirtualHost>
```

### 3. Variables de entorno
Crear archivo `.env` en el backend:
```env
FRONTEND_URL=http://146.83.198.35:1212
PORT=3000
NODE_ENV=production
```

### 4. Verificación
Después de los cambios, verificar:
1. Reiniciar el backend Node.js
2. Reiniciar Apache si se modificó la configuración
3. Limpiar caché del navegador
4. Verificar en DevTools que los headers CORS sean correctos

### 5. Headers esperados en la respuesta
```
Access-Control-Allow-Origin: http://146.83.198.35:1212
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

### 6. Debugging
Para verificar la configuración:
```bash
# Verificar headers CORS
curl -H "Origin: http://146.83.198.35:1212" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -X OPTIONS \
     http://146.83.198.35:3000/api/repuestos/categorias -v

# Verificar request normal
curl -H "Origin: http://146.83.198.35:1212" \
     http://146.83.198.35:3000/api/repuestos/categorias -v
```
