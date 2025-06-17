const express = require('express');
const router = express.Router();
const {
    obtenerRepuestos,
    obtenerRepuesto,
    obtenerTodasCategorias,
    agregarRepuesto,
    editarRepuesto,
    eliminarRepuesto
} = require('../controllers/repuestosController');

router.get('/', obtenerRepuestos);
router.get('/categorias', obtenerTodasCategorias);
router.get('/:id', obtenerRepuesto);
router.post('/', agregarRepuesto);
router.put('/:id', editarRepuesto);
router.delete('/:id', eliminarRepuesto);

module.exports = router;