const favoritosModel = require('../models/favoritosModel');

const obtenerFavoritos = async (req, res) => {
  try {
    const favoritos = await favoritosModel.obtenerFavoritos(req.user.id);
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

const agregarFavorito = async (req, res) => {
  const { repuesto_id } = req.body;
  try {
    console.log('➕ Controller: Agregando favorito repuesto_id:', repuesto_id, 'usuario:', req.user.id);
    const nuevo = await favoritosModel.agregarFavorito(req.user.id, repuesto_id);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('❌ Controller error al agregar:', error);
    if (error.code === '23505') { // código de error PostgreSQL para violación de unique constraint
      res.status(400).json({ error: 'Este repuesto ya está en favoritos' });
    } else {
      res.status(500).json({ error: 'Error al guardar favorito' });
    }
  }
};

const eliminarFavorito = async (req, res) => {
  try {
    console.log('🗑️ Controller: Eliminando favorito ID:', req.params.id);
    const result = await favoritosModel.eliminarFavorito(req.params.id);
    res.json({ mensaje: 'Favorito eliminado', favorito: result });
  } catch (error) {
    console.error('❌ Controller error:', error);
    if (error.message === 'Favorito no encontrado') {
      res.status(404).json({ error: 'Favorito no encontrado' });
    } else {
      res.status(500).json({ error: 'Error al eliminar favorito' });
    }
  }
};

module.exports = {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito
};