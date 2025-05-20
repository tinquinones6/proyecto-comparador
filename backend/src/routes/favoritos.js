const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const favoritosController = require('../controllers/favoritosController');

router.get('/', authMiddleware, favoritosController.obtenerFavoritos);
router.post('/', authMiddleware, favoritosController.agregarFavorito);
router.delete('/:id', authMiddleware, favoritosController.eliminarFavorito);

module.exports = router;