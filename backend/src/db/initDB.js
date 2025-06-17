const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function initDB() {
    try {
        // Leer y ejecutar init.sql
        const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
        await pool.query(initSQL);
        console.log('✅ Tablas creadas/verificadas correctamente');

        // Leer y ejecutar migrations.sql
        const migrationsSQL = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf8');
        await pool.query(migrationsSQL);
        console.log('✅ Migraciones ejecutadas correctamente');

        // Crear tabla de comentarios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS comentarios (
                id SERIAL PRIMARY KEY,
                repuesto_id INTEGER REFERENCES repuestos(id) ON DELETE CASCADE,
                mensaje TEXT NOT NULL,
                tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('price', 'image', 'description', 'other')),
                estado VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (estado IN ('pending', 'reviewed', 'resolved')),
                respuesta_admin TEXT,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
}

module.exports = initDB; 