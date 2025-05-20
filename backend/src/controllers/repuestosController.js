const {
    obtenerTodosLosRepuestos,
    agregarNuevoRepuesto,
    actualizarRepuesto,
    eliminarRepuestoPorId
} = require('../models/repuestoModel');

// GET
const obtenerRepuestos = async (req, res) => {
    try {
        const repuestos = await obtenerTodosLosRepuestos();
        res.json(repuestos);
    } catch (error) {
        console.error('Error al obtener repuestos:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// POST
const agregarRepuesto = async (req, res) => {
    const { nombre, marca, modelo, precio, tienda, url } = req.body;
    try {
        const nuevo = await agregarNuevoRepuesto(nombre, marca, modelo, precio, tienda, url);
        res.json(nuevo);
    } catch (error) {
        console.error('Error al agregar repuesto:', error);
        res.status(500).json({ error: 'Error al agregar repuesto' });
    }
};

// PUT
const editarRepuesto = async (req, res) => {
    const id = req.params.id;
    const { nombre, marca, modelo, precio, tienda, url } = req.body;

    try {
        const actualizado = await actualizarRepuesto(id, nombre, marca, modelo, precio, tienda, url);
        if (!actualizado) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }
        res.json(actualizado);
    } catch (error) {
        console.error('Error al editar repuesto:', error);
        res.status(500).json({ error: 'Error al editar repuesto' });
    }
};

// DELETE
const eliminarRepuesto = async (req, res) => {
    const id = req.params.id;

    try {
        const eliminado = await eliminarRepuestoPorId(id);
        if (!eliminado) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }
        res.json({ mensaje: 'Repuesto eliminado' });
    } catch (error) {
        console.error('Error al eliminar repuesto:', error);
        res.status(500).json({ error: 'Error al eliminar repuesto' });
    }
};

module.exports = {
    obtenerRepuestos,
    agregarRepuesto,
    editarRepuesto,
    eliminarRepuesto
};