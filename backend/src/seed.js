const pool = require('./db');
const bcrypt = require('bcrypt');

async function crearUsuariosIniciales() {
    // Verificar si la tabla usuario existe, si no existe crearla
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuario (
                id_usuario SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) UNIQUE NOT NULL,
                contrasena VARCHAR(100) NOT NULL,
                rol VARCHAR(20) NOT NULL DEFAULT 'cliente'
            );
        `);
    } catch (error) {
        console.log('Tabla usuario ya existe o error al crearla:', error.message);
    }

    const resultado = await pool.query('SELECT COUNT(*) FROM usuario');
    const cantidad = parseInt(resultado.rows[0].count);

    if (cantidad === 0) {
        console.log('No hay usuarios, creando usuarios iniciales...');

        const passwordAdmin = await bcrypt.hash('admin123', 10);
        const passwordCliente = await bcrypt.hash('cliente123', 10);

        await pool.query(
            'INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4)',
            ['Admin', 'admin@proyecto.com', passwordAdmin, 'admin']
        );

        await pool.query(
            'INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4)',
            ['Cliente', 'cliente@proyecto.com', passwordCliente, 'cliente']
        );

        console.log('Usuarios iniciales creados: admin y cliente.');
    } else {
        console.log('Ya existen usuarios en la base de datos. No se crean nuevos.');
    }
}

module.exports = { crearUsuariosIniciales };