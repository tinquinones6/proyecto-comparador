const pool = require('../db');

const obtenerFavoritos = async (usuarioId) => {
  const result = await pool.query(
    'SELECT id, marca, modelo FROM favoritos WHERE usuario_id = $1',
    [usuarioId]
  );
  return result.rows;
};

const agregarFavorito = async (usuarioId, marca, modelo) => {
  const result = await pool.query(
    'INSERT INTO favoritos (usuario_id, marca, modelo) VALUES ($1, $2, $3) RETURNING *',
    [usuarioId, marca, modelo]
  );
  return result.rows[0];
};

const eliminarFavorito = async (id, usuarioId) => {
  await pool.query('DELETE FROM favoritos WHERE id = $1 AND usuario_id = $2', [id, usuarioId]);
};

module.exports = {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito
};