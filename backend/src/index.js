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

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/repuestos', rutasRepuestos);
app.use('/api/auth', rutasAuth);
app.use('/api/favoritos', rutasFavoritos);
app.use('/api/comments', rutasComments);

// 🔁 Verificar conexión y levantar servidor solo si funciona
async function iniciarServidor() {
  try {
    const resultado = await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL:', resultado.rows[0].now);

    // Inicializar base de datos
    await initDB();
    
    await crearUsuariosIniciales();

    app.listen(puerto, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${puerto}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
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