const pool = require('../db');

const usuarioVehiculoModel = {
    // Obtener vehículos de un usuario
    async obtenerVehiculosUsuario(usuarioId) {
        try {
            const query = `
                SELECT 
                    id,
                    marca,
                    modelo,
                    año,
                    es_principal,
                    fecha_creacion
                FROM usuario_vehiculos 
                WHERE usuario_id = $1 
                ORDER BY es_principal DESC, fecha_creacion ASC
            `;
            const result = await pool.query(query, [usuarioId]);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener vehículos del usuario:', error);
            throw error;
        }
    },

    // Agregar vehículo a un usuario
    async agregarVehiculo(usuarioId, { marca, modelo, año, esPrincipal = false }) {
        try {
            // Si este vehículo será principal, desmarcar otros como principales
            if (esPrincipal) {
                await pool.query(
                    'UPDATE usuario_vehiculos SET es_principal = false WHERE usuario_id = $1',
                    [usuarioId]
                );
            }

            const query = `
                INSERT INTO usuario_vehiculos (usuario_id, marca, modelo, año, es_principal)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const result = await pool.query(query, [usuarioId, marca, modelo, año, esPrincipal]);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Violación de constraint UNIQUE
                throw new Error('Ya existe este vehículo en tu perfil');
            }
            console.error('Error al agregar vehículo:', error);
            throw error;
        }
    },

    // Actualizar vehículo
    async actualizarVehiculo(vehiculoId, usuarioId, { marca, modelo, año, esPrincipal }) {
        try {
            // Si este vehículo será principal, desmarcar otros como principales
            if (esPrincipal) {
                await pool.query(
                    'UPDATE usuario_vehiculos SET es_principal = false WHERE usuario_id = $1 AND id != $2',
                    [usuarioId, vehiculoId]
                );
            }

            const query = `
                UPDATE usuario_vehiculos 
                SET marca = $1, modelo = $2, año = $3, es_principal = $4
                WHERE id = $5 AND usuario_id = $6
                RETURNING *
            `;
            const result = await pool.query(query, [marca, modelo, año, esPrincipal, vehiculoId, usuarioId]);
            
            if (result.rows.length === 0) {
                throw new Error('Vehículo no encontrado o no tienes permisos para modificarlo');
            }
            
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            throw error;
        }
    },

    // Eliminar vehículo
    async eliminarVehiculo(vehiculoId, usuarioId) {
        try {
            const query = `
                DELETE FROM usuario_vehiculos 
                WHERE id = $1 AND usuario_id = $2
                RETURNING *
            `;
            const result = await pool.query(query, [vehiculoId, usuarioId]);
            
            if (result.rows.length === 0) {
                throw new Error('Vehículo no encontrado o no tienes permisos para eliminarlo');
            }
            
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            throw error;
        }
    },

    // Establecer vehículo como principal
    async establecerPrincipal(vehiculoId, usuarioId) {
        try {
            // Desmarcar todos los vehículos como principales
            await pool.query(
                'UPDATE usuario_vehiculos SET es_principal = false WHERE usuario_id = $1',
                [usuarioId]
            );

            // Marcar el vehículo seleccionado como principal
            const query = `
                UPDATE usuario_vehiculos 
                SET es_principal = true
                WHERE id = $1 AND usuario_id = $2
                RETURNING *
            `;
            const result = await pool.query(query, [vehiculoId, usuarioId]);
            
            if (result.rows.length === 0) {
                throw new Error('Vehículo no encontrado o no tienes permisos para modificarlo');
            }
            
            return result.rows[0];
        } catch (error) {
            console.error('Error al establecer vehículo principal:', error);
            throw error;
        }
    },

    // Obtener marcas disponibles (basado en los repuestos existentes)
    async obtenerMarcasDisponibles() {
        try {
            const query = `
                SELECT DISTINCT marca 
                FROM repuestos 
                WHERE marca IS NOT NULL AND marca != ''
                ORDER BY marca ASC
            `;
            const result = await pool.query(query);
            return result.rows.map(row => row.marca);
        } catch (error) {
            console.error('Error al obtener marcas disponibles:', error);
            throw error;
        }
    },

    // Obtener modelos disponibles para una marca específica
    async obtenerModelosPorMarca(marca) {
        try {
            const query = `
                SELECT DISTINCT modelo 
                FROM repuestos 
                WHERE marca = $1 AND modelo IS NOT NULL AND modelo != ''
                ORDER BY modelo ASC
            `;
            const result = await pool.query(query, [marca]);
            return result.rows.map(row => row.modelo);
        } catch (error) {
            console.error('Error al obtener modelos por marca:', error);
            throw error;
        }
    }
};

module.exports = usuarioVehiculoModel;
