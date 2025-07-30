const express = require('express');
const router = express.Router();
const {
    obtenerRepuestos,
    obtenerRepuesto,
    obtenerTodasCategorias,
    agregarRepuesto,
    editarRepuesto,
    eliminarRepuesto,
    obtenerTiposPorCategoriaController
} = require('../controllers/repuestosController');

router.get('/', obtenerRepuestos);
router.get('/categorias', obtenerTodasCategorias);
router.get('/tipos/:categoria', obtenerTiposPorCategoriaController);
router.get('/:id', obtenerRepuesto);
router.post('/', agregarRepuesto);
router.put('/:id', editarRepuesto);
router.delete('/:id', eliminarRepuesto);

module.exports = router;