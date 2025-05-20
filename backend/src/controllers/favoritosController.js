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
  const { marca, modelo } = req.body;
  try {
    const nuevo = await favoritosModel.agregarFavorito(req.user.id, marca, modelo);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar favorito' });
  }
};

const eliminarFavorito = async (req, res) => {
  try {
    await favoritosModel.eliminarFavorito(req.params.id, req.user.id);
    res.json({ mensaje: 'Favorito eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
};

module.exports = {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito
};