const pool = require('../db');

const obtenerTodosLosRepuestos = async () => {
    const result = await pool.query('SELECT * FROM repuestos ORDER BY id DESC');
    return result.rows;
};

const obtenerRepuestoPorId = async (id) => {
    const result = await pool.query('SELECT * FROM repuestos WHERE id = $1', [id]);
    return result.rows[0];
};

const obtenerRepuestosPorCategoria = async (categoria) => {
    const result = await pool.query('SELECT * FROM repuestos WHERE categoria = $1', [categoria]);
    return result.rows;
};

const obtenerCategorias = async () => {
    const result = await pool.query('SELECT DISTINCT categoria FROM repuestos');
    return result.rows.map(row => row.categoria);
};

const agregarNuevoRepuesto = async (nombre, marca, modelo, precio, tienda, url, categoria) => {
    const result = await pool.query(
        'INSERT INTO repuestos (nombre, marca, modelo, precio, tienda, url, categoria) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [nombre, marca, modelo, precio, tienda, url, categoria]
    );
    return result.rows[0];
};

const actualizarRepuesto = async (id, nombre, marca, modelo, precio, tienda, url, categoria) => {
    const result = await pool.query(
        'UPDATE repuestos SET nombre = $1, marca = $2, modelo = $3, precio = $4, tienda = $5, url = $6, categoria = $7 WHERE id = $8 RETURNING *',
        [nombre, marca, modelo, precio, tienda, url, categoria, id]
    );
    return result.rows[0];
};

const eliminarRepuestoPorId = async (id) => {
    const result = await pool.query('DELETE FROM repuestos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    obtenerTodosLosRepuestos,
    obtenerRepuestoPorId,
    obtenerRepuestosPorCategoria,
    obtenerCategorias,
    agregarNuevoRepuesto,
    actualizarRepuesto,
    eliminarRepuestoPorId
};