const pool = require('./src/db');

async function migrarTablaVehiculos() {
    try {
        console.log('🔄 Iniciando migración de tabla usuario_vehiculos...');
        
        // Eliminar la restricción UNIQUE existente
        await pool.query(`
            ALTER TABLE usuario_vehiculos 
            DROP CONSTRAINT IF EXISTS usuario_vehiculos_usuario_id_marca_modelo_año_key;
        `);
        console.log('✅ Restricción UNIQUE antigua eliminada');
        
        // Eliminar la columna año si existe
        await pool.query(`
            ALTER TABLE usuario_vehiculos 
            DROP COLUMN IF EXISTS año;
        `);
        console.log('✅ Columna año eliminada');
        
        // Agregar nueva restricción UNIQUE sin el año
        await pool.query(`
            ALTER TABLE usuario_vehiculos 
            ADD CONSTRAINT usuario_vehiculos_usuario_id_marca_modelo_key 
            UNIQUE(usuario_id, marca, modelo);
        `);
        console.log('✅ Nueva restricción UNIQUE agregada');
        
        console.log('🎉 Migración completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    }
}

migrarTablaVehiculos();
