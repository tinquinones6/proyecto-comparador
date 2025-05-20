require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { crearUsuariosIniciales } = require('./seed');

const rutasRepuestos = require('./routes/repuestos');
const rutasAuth = require('./routes/auth');
const rutasFavoritos = require('./routes/favoritos');

const app = express();
const puerto = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/repuestos', rutasRepuestos);
app.use('/api/auth', rutasAuth);
app.use('/api/favoritos', rutasFavoritos);

// 🔁 Verificar conexión y levantar servidor solo si funciona
async function iniciarServidor() {
  try {
    const resultado = await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL:', resultado.rows[0].now);

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