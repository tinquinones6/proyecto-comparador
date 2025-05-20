const express = require('express');
const router = express.Router();
const {
    obtenerRepuestos,
    agregarRepuesto,
    editarRepuesto,
    eliminarRepuesto
} = require('../controllers/repuestosController');

router.get('/', obtenerRepuestos);
router.post('/', agregarRepuesto);
router.put('/:id', editarRepuesto);
router.delete('/:id', eliminarRepuesto);

module.exports = router;