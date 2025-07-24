const pool = require('../db');

const vehiculosUsuarioController = {
    // Obtener marcas disponibles
    obtenerMarcas: async (req, res) => {
        try {
            const query = `
                SELECT id_marca as id, nombre 
                FROM marca 
                ORDER BY nombre ASC
            `;
            
            const result = await pool.query(query);
            
            res.json({
                marcas: result.rows
            });
        } catch (error) {
            console.error('Error al obtener marcas:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener marcas' 
            });
        }
    },

    // Obtener modelos por marca
    obtenerModelosPorMarca: async (req, res) => {
        try {
            const { marcaId } = req.params;
            
            let query, params;
            
            // Si el parámetro es numérico, buscar por ID
            if (!isNaN(marcaId)) {
                query = `
                    SELECT id_modelo as id, nombre 
                    FROM modelo 
                    WHERE id_marca = $1
                    ORDER BY nombre ASC
                `;
                params = [marcaId];
            } else {
                // Si no es numérico, buscar por nombre de marca
                query = `
                    SELECT m.id_modelo as id, m.nombre 
                    FROM modelo m 
                    JOIN marca mar ON m.id_marca = mar.id_marca
                    WHERE mar.nombre = $1
                    ORDER BY m.nombre ASC
                `;
                params = [marcaId];
            }
            
            const result = await pool.query(query, params);
            
            res.json({
                modelos: result.rows
            });
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener modelos' 
            });
        }
    },

    // Obtener vehículos del usuario
    obtenerVehiculosUsuario: async (req, res) => {
        try {
            const { usuario } = req;
            
            const query = `
                SELECT 
                    id,
                    marca,
                    modelo,
                    es_principal,
                    fecha_creacion
                FROM usuario_vehiculos 
                WHERE usuario_id = $1 
                ORDER BY es_principal DESC, fecha_creacion DESC
            `;
            
            const result = await pool.query(query, [usuario.id]);
            
            res.json({
                vehiculos: result.rows
            });
        } catch (error) {
            console.error('Error al obtener vehículos del usuario:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener vehículos' 
            });
        }
    },

    // Agregar vehículo al usuario
    agregarVehiculo: async (req, res) => {
        try {
            const { usuario } = req;
            const { marca, modelo, es_principal = false } = req.body;

            // Validaciones
            if (!marca || !modelo) {
                return res.status(400).json({ 
                    error: 'Marca y modelo son requeridos' 
                });
            }

            // Si es principal, desmarcar otros vehículos principales
            if (es_principal) {
                await pool.query(`
                    UPDATE usuario_vehiculos 
                    SET es_principal = FALSE 
                    WHERE usuario_id = $1
                `, [usuario.id]);
            }

            const query = `
                INSERT INTO usuario_vehiculos (usuario_id, marca, modelo, es_principal)
                VALUES ($1, $2, $3, $4)
                RETURNING id, marca, modelo, es_principal, fecha_creacion
            `;

            const result = await pool.query(query, [
                usuario.id,
                marca,
                modelo,
                es_principal
            ]);

            res.status(201).json({
                message: 'Vehículo agregado exitosamente',
                vehiculo: result.rows[0]
            });

        } catch (error) {
            if (error.code === '23505') { // UNIQUE constraint violation
                return res.status(400).json({ 
                    error: 'Este vehículo ya está registrado en tu perfil' 
                });
            }
            
            console.error('Error al agregar vehículo:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al agregar vehículo' 
            });
        }
    },

    // Actualizar vehículo
    actualizarVehiculo: async (req, res) => {
        try {
            const { usuario } = req;
            const { id } = req.params;
            const { marca, modelo, es_principal } = req.body;

            // Verificar que el vehículo pertenece al usuario
            const vehiculoExistente = await pool.query(`
                SELECT id FROM usuario_vehiculos 
                WHERE id = $1 AND usuario_id = $2
            `, [id, usuario.id]);

            if (vehiculoExistente.rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Vehículo no encontrado' 
                });
            }

            // Si es principal, desmarcar otros vehículos principales
            if (es_principal) {
                await pool.query(`
                    UPDATE usuario_vehiculos 
                    SET es_principal = FALSE 
                    WHERE usuario_id = $1 AND id != $2
                `, [usuario.id, id]);
            }

            const query = `
                UPDATE usuario_vehiculos 
                SET marca = $1, modelo = $2, es_principal = $3
                WHERE id = $4 AND usuario_id = $5
                RETURNING id, marca, modelo, es_principal, fecha_creacion
            `;

            const result = await pool.query(query, [
                marca,
                modelo,
                es_principal || false,
                id,
                usuario.id
            ]);

            res.json({
                message: 'Vehículo actualizado exitosamente',
                vehiculo: result.rows[0]
            });

        } catch (error) {
            if (error.code === '23505') { // UNIQUE constraint violation
                return res.status(400).json({ 
                    error: 'Este vehículo ya está registrado en tu perfil' 
                });
            }
            
            console.error('Error al actualizar vehículo:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al actualizar vehículo' 
            });
        }
    },

    // Eliminar vehículo
    eliminarVehiculo: async (req, res) => {
        try {
            const { usuario } = req;
            const { id } = req.params;

            const result = await pool.query(`
                DELETE FROM usuario_vehiculos 
                WHERE id = $1 AND usuario_id = $2
                RETURNING id
            `, [id, usuario.id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Vehículo no encontrado' 
                });
            }

            res.json({
                message: 'Vehículo eliminado exitosamente'
            });

        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al eliminar vehículo' 
            });
        }
    },

    // Marcar vehículo como principal
    marcarComoPrincipal: async (req, res) => {
        try {
            const { usuario } = req;
            const { id } = req.params;

            // Verificar que el vehículo pertenece al usuario
            const vehiculoExistente = await pool.query(`
                SELECT id FROM usuario_vehiculos 
                WHERE id = $1 AND usuario_id = $2
            `, [id, usuario.id]);

            if (vehiculoExistente.rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Vehículo no encontrado' 
                });
            }

            // Desmarcar todos como principal
            await pool.query(`
                UPDATE usuario_vehiculos 
                SET es_principal = FALSE 
                WHERE usuario_id = $1
            `, [usuario.id]);

            // Marcar el seleccionado como principal
            await pool.query(`
                UPDATE usuario_vehiculos 
                SET es_principal = TRUE 
                WHERE id = $1 AND usuario_id = $2
            `, [id, usuario.id]);

            res.json({
                message: 'Vehículo marcado como principal exitosamente'
            });

        } catch (error) {
            console.error('Error al marcar vehículo como principal:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor' 
            });
        }
    }
};

module.exports = vehiculosUsuarioController;
