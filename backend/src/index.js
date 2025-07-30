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

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://146.83.198.35:1211',
  'http://146.83.198.35:1212',
  'http://146.83.198.35:443',
  'http://146.83.198.35',
  'https://146.83.198.35:1211',
  'https://146.83.198.35:1212',
  'https://146.83.198.35:443',
  'https://146.83.198.35',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middleware CORS dinámico antes de las rutas
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

// Middleware CORS único y limpio como respaldo
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS bloqueado para:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Headers de seguridad adicionales (sin reconfigurar CORS)
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging para desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Ruta de salud
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

// Inicializar base de datos y arrancar servidor
async function iniciarServidor() {
  try {
    console.log('Verificando conexión a la base de datos...');
    const resultado = await pool.query('SELECT NOW()');
    console.log('Conectado a PostgreSQL:', resultado.rows[0].now);

    console.log('Configuración del servidor:');
    console.log(`   - Puerto: ${puerto}`);
    console.log(`   - Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   - Base de datos: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);

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
    process.exit(1);
  }
}

iniciarServidor();

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});