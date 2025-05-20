const pool = require('../db');

const obtenerTodosLosRepuestos = async () => {
    const resultado = await pool.query('SELECT * FROM repuestos');
    return resultado.rows;
};

const agregarNuevoRepuesto = async (nombre, marca, modelo, precio, tienda, url) => {
    const resultado = await pool.query(
        'INSERT INTO repuestos (nombre, marca, modelo, precio, tienda, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombre, marca, modelo, precio, tienda, url]
    );
    return resultado.rows[0];
};

const actualizarRepuesto = async (id, nombre, marca, modelo, precio, tienda, url) => {
    const resultado = await pool.query(
        'UPDATE repuestos SET nombre=$1, marca=$2, modelo=$3, precio=$4, tienda=$5, url=$6 WHERE id=$7 RETURNING *',
        [nombre, marca, modelo, precio, tienda, url, id]
    );
    return resultado.rows[0];
};

const eliminarRepuestoPorId = async (id) => {
    const resultado = await pool.query('DELETE FROM repuestos WHERE id = $1 RETURNING *', [id]);
    return resultado.rows[0];
};

module.exports = {
    obtenerTodosLosRepuestos,
    agregarNuevoRepuesto,
    actualizarRepuesto,
    eliminarRepuestoPorId
};