const pool = require('./db');
const bcrypt = require('bcrypt');

async function crearUsuariosIniciales() {
    const resultado = await pool.query('SELECT COUNT(*) FROM usuarios');
    const cantidad = parseInt(resultado.rows[0].count);

    if (cantidad === 0) {
        console.log('No hay usuarios, creando usuarios iniciales...');

        const passwordAdmin = await bcrypt.hash('admin123', 10);
        const passwordCliente = await bcrypt.hash('cliente123', 10);

        await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4)',
            ['Admin', 'admin@proyecto.com', passwordAdmin, 'admin']
        );

        await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4)',
            ['Cliente', 'cliente@proyecto.com', passwordCliente, 'cliente']
        );

        console.log('Usuarios iniciales creados: admin y cliente.');
    } else {
        console.log('Ya existen usuarios en la base de datos. No se crean nuevos.');
    }
}

module.exports = { crearUsuariosIniciales };