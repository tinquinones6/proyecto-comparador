require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const initDB = require('./db/initDB');
const { crearUsuariosIniciales } = require('./seed');

const rutasRepuestos = require('./routes/repuestos');
const rutasAuth = require('./routes/auth');
const rutasFavoritos = require('./routes/favoritos');
const rutasComments = require('./routes/comments');

const app = express();
const puerto = process.env.PORT || 3000;

// Configuración CORS dinámica
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como aplicaciones móviles o Postman)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:5173',      // Desarrollo local (Vite)
      'http://localhost:3000',      // Desarrollo local alternativo
      'http://127.0.0.1:5173',      // Desarrollo local IP
      'http://146.83.198.35:1211',  // Producción Apache puerto 1211
      'http://146.83.198.35:1212',  // Producción Apache puerto 1212
      'http://146.83.198.35',       // Producción sin puerto
      'https://146.83.198.35:1211', // HTTPS puerto 1211
      'https://146.83.198.35:1212', // HTTPS puerto 1212
      'https://146.83.198.35',      // HTTPS sin puerto
      process.env.FRONTEND_URL      // URL del frontend desde .env
    ].filter(Boolean); // Filtrar valores undefined/null
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS bloqueado para origen:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Headers de seguridad y CORS adicionales
app.use((req, res, next) => {
  // Headers CORS adicionales para compatibilidad con Apache
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://146.83.198.35:1211',
    'http://146.83.198.35:1212',
    'http://146.83.198.35',
    'https://146.83.198.35:1211',
    'https://146.83.198.35:1212',
    'https://146.83.198.35',
    process.env.FRONTEND_URL
  ].filter(Boolean);
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Expose-Headers', 'Authorization');
  
  // Headers de seguridad
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Manejar preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware de logging para desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: puerto
  });
});

// Rutas principales
app.use('/api/repuestos', rutasRepuestos);
app.use('/api/auth', rutasAuth);
app.use('/api/favoritos', rutasFavoritos);
app.use('/api/comments', rutasComments);

// 🔁 Verificar conexión y levantar servidor solo si funciona
async function iniciarServidor() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    const resultado = await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL:', resultado.rows[0].now);

    // Mostrar configuración de entorno
    console.log('🔧 Configuración del servidor:');
    console.log(`   - Puerto: ${puerto}`);
    console.log(`   - Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   - Base de datos: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);

    // Inicializar base de datos
    console.log('🏗️  Inicializando base de datos...');
    await initDB();
    
    console.log('👥 Creando usuarios iniciales...');
    await crearUsuariosIniciales();

    app.listen(puerto, '0.0.0.0', () => {
      console.log(`🚀 Servidor backend corriendo en http://0.0.0.0:${puerto}`);
      console.log(`📍 API disponible en: http://localhost:${puerto}/api`);
      console.log(`❤️  Health check: http://localhost:${puerto}/api/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    console.error('   Detalles:', error);
    process.exit(1); // Terminar si falla la conexión
  }
}

iniciarServidor();

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});