const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function initDB() {
    try {
        console.log('✅ Usando base de datos scrapeada existente - datos_scrapeados');
        
        // Verificar que las tablas existan
        const tablesCheck = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('repuestos', 'marca', 'modelo', 'categoria', 'tienda', 'usuario', 'favoritos')
        `);
        
        console.log('✅ Tablas encontradas:', tablesCheck.rows.map(row => row.table_name));

        // Verificar estructura de la tabla repuestos para obtener el tipo de dato del id_repuesto
        const repuestosCheck = await pool.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'repuestos' AND table_schema = 'public'
            AND column_name = 'id_repuesto'
        `);
        
        console.log('✅ Información del campo id_repuesto:', repuestosCheck.rows);

        // Crear tabla de comentarios con el tipo de datos correcto para la foreign key
        const idRepuestoType = repuestosCheck.rows[0]?.data_type === 'character varying' ? 'VARCHAR(20)' : 'INTEGER';
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS comentarios (
                id SERIAL PRIMARY KEY,
                repuesto_id ${idRepuestoType} REFERENCES repuestos(id_repuesto) ON DELETE CASCADE,
                mensaje TEXT NOT NULL,
                tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('price', 'image', 'description', 'other')),
                estado VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (estado IN ('pending', 'reviewed', 'resolved')),
                respuesta_admin TEXT,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabla de comentarios verificada/creada con tipo de datos correcto');
        // Crear/actualizar tabla de favoritos si es necesario
        await pool.query(`
            CREATE TABLE IF NOT EXISTS favoritos (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                repuesto_id ${idRepuestoType} REFERENCES repuestos(id_repuesto) ON DELETE CASCADE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(usuario_id, repuesto_id)
            );
        `);
        console.log('✅ Tabla de favoritos verificada/creada');

        // Crear tabla de preferencias de vehículo del usuario
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuario_vehiculos (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                marca VARCHAR(100) NOT NULL,
                modelo VARCHAR(100) NOT NULL,
                es_principal BOOLEAN DEFAULT FALSE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(usuario_id, marca, modelo)
            );
        `);
        console.log('✅ Tabla de usuario_vehiculos creada/verificada');

        // Verificar estructura de la tabla usuario
        const usuarioCheck = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'usuario' AND table_schema = 'public'
        `);
        
        console.log('✅ Columnas de usuario:', usuarioCheck.rows.map(row => row.column_name));

        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
}

module.exports = initDB; 