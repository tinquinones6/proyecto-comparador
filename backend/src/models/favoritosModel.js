const pool = require('../db');

const obtenerFavoritos = async (usuarioId) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.id_favorito as id,
        f.id_repuesto as repuesto_id,
        r.id_repuesto,
        r.nombre,
        ma.nombre as marca,
        mo.nombre as modelo,
        r.precio,
        t.nombre as tienda,
        r.link as url,
        c.categoria as categoria,
        r.imagen as imagen_url,
        r.descripcion,
        f.id_usuario as usuario_id
      FROM favoritos f 
      JOIN repuestos r ON f.id_repuesto = r.id_repuesto 
      LEFT JOIN modelo mo ON r.id_modelo = mo.id_modelo
      LEFT JOIN marca ma ON mo.id_marca = ma.id_marca
      LEFT JOIN tienda t ON r.id_tienda = t.id_tienda
      LEFT JOIN tipo_repuesto tr ON r.id_tipo = tr.id_tipo
      LEFT JOIN categoria c ON tr.id_categoria = c.id_categoria
      WHERE f.id_usuario = $1
    `, [usuarioId]);
    return result.rows;
  } catch (error) {
    console.error('❌ Error en obtenerFavoritos:', error);
    throw error;
  }
};

const agregarFavorito = async (usuarioId, repuestoId) => {
  try {
    const result = await pool.query(
      'INSERT INTO favoritos (id_usuario, id_repuesto) VALUES ($1, $2) RETURNING *',
      [usuarioId, repuestoId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en agregarFavorito:', error);
    throw error;
  }
};

const eliminarFavorito = async (favoritoId) => {
  try {
    console.log('🗑️ Backend: Eliminando favorito con ID:', favoritoId);
    const result = await pool.query('DELETE FROM favoritos WHERE id_favorito = $1 RETURNING *', [favoritoId]);
    
    if (result.rows.length === 0) {
      throw new Error('Favorito no encontrado');
    }
    
    console.log('✅ Backend: Favorito eliminado:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en eliminarFavorito:', error);
    throw error;
  }
};

module.exports = {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito
};