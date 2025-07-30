const {
    obtenerTodosLosRepuestos,
    obtenerRepuestoPorId,
    obtenerRepuestosPorCategoria,
    obtenerRepuestosPorCategoriaYTipo,
    obtenerCategorias,
    agregarNuevoRepuesto,
    actualizarRepuesto,
    eliminarRepuestoPorId,
    obtenerTiposPorCategoria
} = require('../models/repuestoModel');

// GET todos los repuestos
const obtenerRepuestos = async (req, res) => {
    const { categoria, tipo } = req.query;
    try {
        let repuestos;
        if (categoria && tipo) {
            repuestos = await obtenerRepuestosPorCategoriaYTipo(categoria, tipo);
        } else if (categoria) {
            repuestos = await obtenerRepuestosPorCategoria(categoria);
        } else {
            repuestos = await obtenerTodosLosRepuestos();
        }
        res.json(repuestos);
    } catch (error) {
        console.error('Error al obtener repuestos:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// GET repuesto por ID
const obtenerRepuesto = async (req, res) => {
    const { id } = req.params;
    try {
        const repuesto = await obtenerRepuestoPorId(id);
        if (!repuesto) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }
        res.json(repuesto);
    } catch (error) {
        console.error('Error al obtener repuesto:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// GET categorías
const obtenerTodasCategorias = async (req, res) => {
    try {
        const categorias = await obtenerCategorias();
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// POST nuevo repuesto
const agregarRepuesto = async (req, res) => {
    const { nombre, marca, modelo, precio, tienda, url, categoria, tipo } = req.body;
    try {
        const nuevo = await agregarNuevoRepuesto(nombre, marca, modelo, precio, tienda, url, categoria, tipo);
        res.json(nuevo);
    } catch (error) {
        console.error('Error al agregar repuesto:', error);
        res.status(500).json({ error: 'Error al agregar repuesto' });
    }
};

// PUT actualizar repuesto
const editarRepuesto = async (req, res) => {
    const id = req.params.id;
    const { nombre, marca, modelo, precio, tienda, url, categoria, tipo } = req.body;

    try {
        const actualizado = await actualizarRepuesto(id, nombre, marca, modelo, precio, tienda, url, categoria, tipo);
        if (!actualizado) {
            return res.status(404).json({ error: 'Repuesto no encontrado' });
        }
        res.json(actualizado);
    } catch (error) {
        console.error('Error al editar repuesto:', error);
        res.status(500).json({ error: 'Error al editar repuesto' });
    }
};

// DELETE eliminar repuesto
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

// GET tipos por categoría
const obtenerTiposPorCategoriaController = async (req, res) => {
    const { categoria } = req.params;
    try {
        const tipos = await obtenerTiposPorCategoria(categoria);
        res.json(tipos);
    } catch (error) {
        console.error('Error al obtener tipos por categoría:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = {
    obtenerRepuestos,
    obtenerRepuesto,
    obtenerTodasCategorias,
    agregarRepuesto,
    editarRepuesto,
    eliminarRepuesto,
    obtenerTiposPorCategoriaController
};