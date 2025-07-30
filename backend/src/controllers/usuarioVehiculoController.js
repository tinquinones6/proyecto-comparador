const usuarioVehiculoModel = require('../models/usuarioVehiculoModel');

const usuarioVehiculoController = {
    // Obtener vehículos del usuario autenticado
    async obtenerVehiculos(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const vehiculos = await usuarioVehiculoModel.obtenerVehiculosUsuario(usuarioId);
            
            res.json({
                success: true,
                data: vehiculos
            });
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los vehículos del usuario'
            });
        }
    },

    // Agregar nuevo vehículo
    async agregarVehiculo(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { marca, modelo, año, esPrincipal } = req.body;

            // Validaciones básicas
            if (!marca || !modelo) {
                return res.status(400).json({
                    success: false,
                    message: 'Marca y modelo son obligatorios'
                });
            }

            if (año && (año < 1900 || año > new Date().getFullYear() + 1)) {
                return res.status(400).json({
                    success: false,
                    message: 'Año inválido'
                });
            }

            const nuevoVehiculo = await usuarioVehiculoModel.agregarVehiculo(usuarioId, {
                marca: marca.trim(),
                modelo: modelo.trim(),
                año: año ? parseInt(año) : null,
                esPrincipal: Boolean(esPrincipal)
            });

            res.status(201).json({
                success: true,
                message: 'Vehículo agregado correctamente',
                data: nuevoVehiculo
            });
        } catch (error) {
            console.error('Error al agregar vehículo:', error);
            if (error.message === 'Ya existe este vehículo en tu perfil') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al agregar el vehículo'
            });
        }
    },

    // Actualizar vehículo existente
    async actualizarVehiculo(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const vehiculoId = parseInt(req.params.id);
            const { marca, modelo, año, esPrincipal } = req.body;

            // Validaciones básicas
            if (!marca || !modelo) {
                return res.status(400).json({
                    success: false,
                    message: 'Marca y modelo son obligatorios'
                });
            }

            if (año && (año < 1900 || año > new Date().getFullYear() + 1)) {
                return res.status(400).json({
                    success: false,
                    message: 'Año inválido'
                });
            }

            const vehiculoActualizado = await usuarioVehiculoModel.actualizarVehiculo(vehiculoId, usuarioId, {
                marca: marca.trim(),
                modelo: modelo.trim(),
                año: año ? parseInt(año) : null,
                esPrincipal: Boolean(esPrincipal)
            });

            res.json({
                success: true,
                message: 'Vehículo actualizado correctamente',
                data: vehiculoActualizado
            });
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            if (error.message.includes('no encontrado') || error.message.includes('no tienes permisos')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el vehículo'
            });
        }
    },

    // Eliminar vehículo
    async eliminarVehiculo(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const vehiculoId = parseInt(req.params.id);

            await usuarioVehiculoModel.eliminarVehiculo(vehiculoId, usuarioId);

            res.json({
                success: true,
                message: 'Vehículo eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            if (error.message.includes('no encontrado') || error.message.includes('no tienes permisos')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el vehículo'
            });
        }
    },

    // Establecer vehículo como principal
    async establecerPrincipal(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const vehiculoId = parseInt(req.params.id);

            const vehiculoActualizado = await usuarioVehiculoModel.establecerPrincipal(vehiculoId, usuarioId);

            res.json({
                success: true,
                message: 'Vehículo establecido como principal',
                data: vehiculoActualizado
            });
        } catch (error) {
            console.error('Error al establecer vehículo principal:', error);
            if (error.message.includes('no encontrado') || error.message.includes('no tienes permisos')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al establecer vehículo principal'
            });
        }
    },

    // Obtener marcas disponibles
    async obtenerMarcas(req, res) {
        try {
            const marcas = await usuarioVehiculoModel.obtenerMarcasDisponibles();
            
            res.json({
                success: true,
                data: marcas
            });
        } catch (error) {
            console.error('Error al obtener marcas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las marcas disponibles'
            });
        }
    },

    // Obtener modelos por marca
    async obtenerModelosPorMarca(req, res) {
        try {
            const { marca } = req.params;
            
            if (!marca) {
                return res.status(400).json({
                    success: false,
                    message: 'Marca es requerida'
                });
            }

            const modelos = await usuarioVehiculoModel.obtenerModelosPorMarca(marca);
            
            res.json({
                success: true,
                data: modelos
            });
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los modelos'
            });
        }
    }
};

module.exports = usuarioVehiculoController;
