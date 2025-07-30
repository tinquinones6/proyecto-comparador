import api from '../config/api';

export const vehiculosService = {
    // Obtener marcas disponibles
    obtenerMarcas: async () => {
        try {
            const response = await api.get('/auth/marcas');
            return response.data.marcas;
        } catch (error) {
            console.error('Error al obtener marcas:', error);
            throw new Error('Error al cargar las marcas disponibles');
        }
    },

    // Obtener modelos por marca (usando nombre de marca)
    obtenerModelosPorMarca: async (marcaId) => {
        try {
            const response = await api.get(`/auth/marcas/${marcaId}/modelos`);
            return response.data.modelos;
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            throw new Error('Error al cargar los modelos');
        }
    },

    // Obtener vehículos del usuario
    obtenerVehiculos: async () => {
        try {
            const response = await api.get('/auth/vehiculos');
            return response.data.vehiculos;
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw new Error('Error al cargar tus vehículos');
        }
    },

    // Agregar vehículo
    agregarVehiculo: async (vehiculo) => {
        try {
            const response = await api.post('/auth/vehiculos', {
                marca: vehiculo.marca,
                modelo: vehiculo.modelo,
                es_principal: vehiculo.es_principal || false
            });
            return response.data;
        } catch (error) {
            console.error('Error al agregar vehículo:', error);
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Error al agregar el vehículo');
        }
    },

    // Actualizar vehículo
    actualizarVehiculo: async (id, vehiculo) => {
        try {
            const response = await api.put(`/auth/vehiculos/${id}`, {
                marca: vehiculo.marca,
                modelo: vehiculo.modelo,
                es_principal: vehiculo.es_principal || false
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Error al actualizar el vehículo');
        }
    },

    // Eliminar vehículo
    eliminarVehiculo: async (id) => {
        try {
            await api.delete(`/auth/vehiculos/${id}`);
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            throw new Error('Error al eliminar el vehículo');
        }
    },

    // Marcar como principal
    marcarComoPrincipal: async (id) => {
        try {
            await api.patch(`/auth/vehiculos/${id}/principal`, {});
        } catch (error) {
            console.error('Error al marcar como principal:', error);
            throw new Error('Error al marcar como vehículo principal');
        }
    }
};
