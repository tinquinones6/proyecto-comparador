const express = require('express');
const router = express.Router();
const usuarioVehiculoController = require('../controllers/usuarioVehiculoController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas para vehículos del usuario
router.get('/', usuarioVehiculoController.obtenerVehiculos);
router.post('/', usuarioVehiculoController.agregarVehiculo);
router.put('/:id', usuarioVehiculoController.actualizarVehiculo);
router.delete('/:id', usuarioVehiculoController.eliminarVehiculo);
router.patch('/:id/principal', usuarioVehiculoController.establecerPrincipal);

// Rutas para obtener marcas y modelos disponibles
router.get('/marcas', usuarioVehiculoController.obtenerMarcas);
router.get('/modelos/:marca', usuarioVehiculoController.obtenerModelosPorMarca);

module.exports = router;
