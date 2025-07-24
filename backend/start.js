#!/usr/bin/env node

// Cambiar al directorio correcto
process.chdir(__dirname);

// Cargar variables de entorno desde el archivo .env local
require('dotenv').config();

// Iniciar el servidor
require('./src/index.js');
