const pool = require('../db');

const obtenerTodosLosRepuestos = async () => {
    try {
        console.log('🔍 Ejecutando consulta de todos los repuestos...');
        const result = await pool.query(`
            SELECT 
                r.id_repuesto as id,
                r.id_repuesto,
                r.nombre,
                ma.nombre as marca,
                mo.nombre as modelo,
                r.precio,
                t.nombre as tienda,
                r.link as url,
                c.categoria as categoria,
                tr.nombre as tipo,
                r.imagen as imagen_url,
                r.descripcion
            FROM repuestos r
            LEFT JOIN modelo mo ON r.id_modelo = mo.id_modelo
            LEFT JOIN marca ma ON mo.id_marca = ma.id_marca  
            LEFT JOIN tienda t ON r.id_tienda = t.id_tienda
            LEFT JOIN tipo_repuesto tr ON r.id_tipo = tr.id_tipo
            LEFT JOIN categoria c ON tr.id_categoria = c.id_categoria
            ORDER BY r.id_repuesto DESC
        `);
        console.log('✅ Consulta exitosa, filas encontradas:', result.rows.length);
        return result.rows;
    } catch (error) {
        console.error('❌ Error en obtenerTodosLosRepuestos:', error);
        throw error;
    }
};

const obtenerRepuestoPorId = async (id) => {
    try {
        const result = await pool.query(`
            SELECT 
                r.id_repuesto as id,
                r.id_repuesto,
                r.nombre,
                ma.nombre as marca,
                mo.nombre as modelo,
                r.precio,
                t.nombre as tienda,
                r.link as url,
                c.categoria as categoria,
                tr.nombre as tipo,
                r.imagen as imagen_url,
                r.descripcion
            FROM repuestos r
            LEFT JOIN modelo mo ON r.id_modelo = mo.id_modelo
            LEFT JOIN marca ma ON mo.id_marca = ma.id_marca  
            LEFT JOIN tienda t ON r.id_tienda = t.id_tienda
            LEFT JOIN tipo_repuesto tr ON r.id_tipo = tr.id_tipo
            LEFT JOIN categoria c ON tr.id_categoria = c.id_categoria
            WHERE r.id_repuesto = $1
        `, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('❌ Error en obtenerRepuestoPorId:', error);
        throw error;
    }
};

const obtenerRepuestosPorCategoria = async (categoria) => {
    try {
        const result = await pool.query(`
            SELECT 
                r.id_repuesto as id,
                r.id_repuesto,
                r.nombre,
                ma.nombre as marca,
                mo.nombre as modelo,
                r.precio,
                t.nombre as tienda,
                r.link as url,
                c.categoria as categoria,
                tr.nombre as tipo,
                r.imagen as imagen_url,
                r.descripcion
            FROM repuestos r
            LEFT JOIN modelo mo ON r.id_modelo = mo.id_modelo
            LEFT JOIN marca ma ON mo.id_marca = ma.id_marca  
            LEFT JOIN tienda t ON r.id_tienda = t.id_tienda
            LEFT JOIN tipo_repuesto tr ON r.id_tipo = tr.id_tipo
            LEFT JOIN categoria c ON tr.id_categoria = c.id_categoria
            WHERE c.categoria = $1
            ORDER BY r.precio ASC
        `, [categoria]);
        return result.rows;
    } catch (error) {
        console.error('❌ Error en obtenerRepuestosPorCategoria:', error);
        throw error;
    }
};

const obtenerRepuestosPorCategoriaYTipo = async (categoria, tipo) => {
    try {
        const result = await pool.query(`
            SELECT 
                r.id_repuesto as id,
                r.id_repuesto,
                r.nombre,
                ma.nombre as marca,
                mo.nombre as modelo,
                r.precio,
                t.nombre as tienda,
                r.link as url,
                c.categoria as categoria,
                tr.nombre as tipo,
                r.imagen as imagen_url,
                r.descripcion
            FROM repuestos r
            LEFT JOIN modelo mo ON r.id_modelo = mo.id_modelo
            LEFT JOIN marca ma ON mo.id_marca = ma.id_marca  
            LEFT JOIN tienda t ON r.id_tienda = t.id_tienda
            LEFT JOIN tipo_repuesto tr ON r.id_tipo = tr.id_tipo
            LEFT JOIN categoria c ON tr.id_categoria = c.id_categoria
            WHERE c.categoria = $1 AND tr.nombre = $2
            ORDER BY r.precio ASC
        `, [categoria, tipo]);
        return result.rows;
    } catch (error) {
        console.error('❌ Error en obtenerRepuestosPorCategoriaYTipo:', error);
        throw error;
    }
};

const obtenerCategorias = async () => {
    try {
        const result = await pool.query('SELECT categoria FROM categoria');
        return result.rows.map(row => row.categoria);
    } catch (error) {
        console.error('❌ Error en obtenerCategorias:', error);
        throw error;
    }
};

// Función auxiliar para obtener o crear marca
const obtenerOCrearMarca = async (nombreMarca) => {
    try {
        let result = await pool.query('SELECT id_marca FROM marca WHERE nombre = $1', [nombreMarca]);
        if (result.rows.length === 0) {
            result = await pool.query('INSERT INTO marca (nombre) VALUES ($1) RETURNING id_marca', [nombreMarca]);
        }
        return result.rows[0].id_marca;
    } catch (error) {
        console.error('❌ Error en obtenerOCrearMarca:', error);
        throw error;
    }
};

// Función auxiliar para obtener o crear modelo
const obtenerOCrearModelo = async (nombreModelo, marcaId) => {
    try {
        let result = await pool.query('SELECT id_modelo FROM modelo WHERE nombre = $1 AND id_marca = $2', [nombreModelo, marcaId]);
        if (result.rows.length === 0) {
            result = await pool.query('INSERT INTO modelo (nombre, id_marca) VALUES ($1, $2) RETURNING id_modelo', [nombreModelo, marcaId]);
        }
        return result.rows[0].id_modelo;
    } catch (error) {
        console.error('❌ Error en obtenerOCrearModelo:', error);
        throw error;
    }
};

// Función auxiliar para obtener o crear categoría
const obtenerOCrearCategoria = async (nombreCategoria) => {
    try {
        let result = await pool.query('SELECT id_categoria FROM categoria WHERE categoria = $1', [nombreCategoria]);
        if (result.rows.length === 0) {
            result = await pool.query('INSERT INTO categoria (categoria) VALUES ($1) RETURNING id_categoria', [nombreCategoria]);
        }
        return result.rows[0].id_categoria;
    } catch (error) {
        console.error('❌ Error en obtenerOCrearCategoria:', error);
        throw error;
    }
};

// Función auxiliar para obtener o crear tienda
const obtenerOCrearTienda = async (nombreTienda) => {
    try {
        let result = await pool.query('SELECT id_tienda FROM tienda WHERE nombre = $1', [nombreTienda]);
        if (result.rows.length === 0) {
            result = await pool.query('INSERT INTO tienda (nombre) VALUES ($1) RETURNING id_tienda', [nombreTienda]);
        }
        return result.rows[0].id_tienda;
    } catch (error) {
        console.error('❌ Error en obtenerOCrearTienda:', error);
        throw error;
    }
};

// Función auxiliar para obtener o crear tipo_repuesto
const obtenerOCrearTipoRepuesto = async (categoriaId, nombreTipo = null) => {
    try {
        if (nombreTipo) {
            // Buscar tipo específico por nombre y categoría
            let result = await pool.query(
                'SELECT id_tipo FROM tipo_repuesto WHERE nombre = $1 AND id_categoria = $2', 
                [nombreTipo, categoriaId]
            );
            
            if (result.rows.length === 0) {
                // Si no existe, crear el tipo específico
                result = await pool.query(
                    'INSERT INTO tipo_repuesto (nombre, id_categoria) VALUES ($1, $2) RETURNING id_tipo', 
                    [nombreTipo, categoriaId]
                );
            }
            
            return result.rows[0].id_tipo;
        } else {
            // Buscar si ya existe un tipo para esta categoría
            let result = await pool.query('SELECT id_tipo FROM tipo_repuesto WHERE id_categoria = $1 LIMIT 1', [categoriaId]);
            
            if (result.rows.length === 0) {
                // Si no existe, crear uno genérico para la categoría
                result = await pool.query('INSERT INTO tipo_repuesto (nombre, id_categoria) VALUES ($1, $2) RETURNING id_tipo', ['General', categoriaId]);
            }
            
            return result.rows[0].id_tipo;
        }
    } catch (error) {
        console.error('❌ Error en obtenerOCrearTipoRepuesto:', error);
        throw error;
    }
};

const agregarNuevoRepuesto = async (nombre, marca, modelo, precio, tienda, url, categoria, tipo = null, descripcion = null, imagen = null) => {
    try {
        // Obtener o crear los IDs de las tablas relacionadas
        const marcaId = await obtenerOCrearMarca(marca);
        const modeloId = await obtenerOCrearModelo(modelo, marcaId);
        const categoriaId = await obtenerOCrearCategoria(categoria);
        const tiendaId = await obtenerOCrearTienda(tienda);
        
        // Obtener o crear el tipo específico para esta categoría
        const tipoId = tipo ? 
            await obtenerOCrearTipoRepuesto(categoriaId, tipo) : 
            await obtenerOCrearTipoRepuesto(categoriaId);

        const result = await pool.query(
            'INSERT INTO repuestos (nombre, id_modelo, precio, id_tienda, link, id_tipo, descripcion, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_repuesto as id',
            [nombre, modeloId, precio, tiendaId, url, tipoId, descripcion, imagen]
        );
        
        // Retornar el repuesto completo con los nombres
        return {
            id: result.rows[0].id,
            nombre,
            marca,
            modelo,
            precio,
            tienda,
            url,
            categoria,
            tipo,
            descripcion,
            imagen_url: imagen
        };
    } catch (error) {
        console.error('❌ Error en agregarNuevoRepuesto:', error);
        throw error;
    }
};

const actualizarRepuesto = async (id, nombre, marca, modelo, precio, tienda, url, categoria, tipo = null, descripcion = null, imagen = null) => {
    try {
        // Obtener o crear los IDs de las tablas relacionadas
        const marcaId = await obtenerOCrearMarca(marca);
        const modeloId = await obtenerOCrearModelo(modelo, marcaId);
        const categoriaId = await obtenerOCrearCategoria(categoria);
        const tiendaId = await obtenerOCrearTienda(tienda);
        
        // Obtener o crear el tipo específico para esta categoría
        const tipoId = tipo ? 
            await obtenerOCrearTipoRepuesto(categoriaId, tipo) : 
            await obtenerOCrearTipoRepuesto(categoriaId);

        const result = await pool.query(
            'UPDATE repuestos SET nombre = $1, id_modelo = $2, precio = $3, id_tienda = $4, link = $5, id_tipo = $6, descripcion = $7, imagen = $8 WHERE id_repuesto = $9 RETURNING id_repuesto as id',
            [nombre, modeloId, precio, tiendaId, url, tipoId, descripcion, imagen, id]
        );
        
        if (result.rows.length === 0) return null;
        
        // Retornar el repuesto completo con los nombres
        return {
            id: result.rows[0].id,
            nombre,
            marca,
            modelo,
            precio,
            tienda,
            url,
            categoria,
            tipo,
            descripcion,
            imagen_url: imagen
        };
    } catch (error) {
        console.error('❌ Error en actualizarRepuesto:', error);
        throw error;
    }
};

const eliminarRepuestoPorId = async (id) => {
    try {
        const result = await pool.query('DELETE FROM repuestos WHERE id_repuesto = $1 RETURNING id_repuesto as id', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('❌ Error en eliminarRepuestoPorId:', error);
        throw error;
    }
};

const buscarRepuestos = async (searchTerm, categoria = null) => {
    try {
        let query = `
            SELECT 
                r.id_repuesto as id,
                r.nombre,
                ma.nombre as marca,
                mo.nombre as modelo,
                r.precio,
                t.nombre as tienda,
                r.link as url,
                c.categoria as categoria,
                r.imagen as imagen_url,
                r.descripcion
            FROM repuestos r
            LEFT JOIN modelo mo ON r.id_modelo = mo.id_modelo
            LEFT JOIN marca ma ON mo.id_marca = ma.id_marca  
            LEFT JOIN tienda t ON r.id_tienda = t.id_tienda
            LEFT JOIN tipo_repuesto tr ON r.id_tipo = tr.id_tipo
            LEFT JOIN categoria c ON tr.id_categoria = c.id_categoria
            WHERE (
                r.nombre ILIKE $1 OR 
                ma.nombre ILIKE $1 OR 
                mo.nombre ILIKE $1 OR 
                c.categoria ILIKE $1 OR
                r.descripcion ILIKE $1
            )
        `;
        
        const params = [`%${searchTerm}%`];
        
        if (categoria) {
            query += ' AND c.categoria = $2';
            params.push(categoria);
        }
        
        query += ' ORDER BY r.precio ASC';
        
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('❌ Error en buscarRepuestos:', error);
        throw error;
    }
};

const obtenerEstadisticasCategoria = async (categoria) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_productos,
                COUNT(DISTINCT ma.nombre) as total_marcas,
                COUNT(DISTINCT mo.nombre) as total_modelos,
                COUNT(DISTINCT t.nombre) as total_tiendas,
                MIN(r.precio) as precio_minimo,
                MAX(r.precio) as precio_maximo,
                AVG(r.precio) as precio_promedio
            FROM repuestos r
            LEFT JOIN modelo mo ON r.id_modelo = mo.id_modelo
            LEFT JOIN marca ma ON mo.id_marca = ma.id_marca  
            LEFT JOIN tienda t ON r.id_tienda = t.id_tienda
            LEFT JOIN tipo_repuesto tr ON r.id_tipo = tr.id_tipo
            LEFT JOIN categoria c ON tr.id_categoria = c.id_categoria
            WHERE c.categoria = $1
        `, [categoria]);
        
        return result.rows[0];
    } catch (error) {
        console.error('❌ Error en obtenerEstadisticasCategoria:', error);
        throw error;
    }
};

module.exports = {
    obtenerTodosLosRepuestos,
    obtenerRepuestoPorId,
    obtenerRepuestosPorCategoria,
    obtenerRepuestosPorCategoriaYTipo,
    obtenerEstadisticasCategoria,
    buscarRepuestos,
    obtenerCategorias,
    agregarNuevoRepuesto,
    actualizarRepuesto,
    eliminarRepuestoPorId,
    obtenerTiposPorCategoria: async (categoria) => {
        try {
            const result = await pool.query(`
                SELECT 
                    tr.id_tipo, 
                    tr.nombre,
                    COUNT(r.id_repuesto) as cantidad,
                    MIN(r.precio) as precio_minimo,
                    MAX(r.precio) as precio_maximo,
                    AVG(r.precio) as precio_promedio,
                    COUNT(DISTINCT ma.nombre) as marcas_disponibles,
                    COUNT(DISTINCT t.nombre) as tiendas_disponibles
                FROM tipo_repuesto tr
                JOIN categoria c ON tr.id_categoria = c.id_categoria
                LEFT JOIN repuestos r ON r.id_tipo = tr.id_tipo
                LEFT JOIN modelo mo ON r.id_modelo = mo.id_modelo
                LEFT JOIN marca ma ON mo.id_marca = ma.id_marca
                LEFT JOIN tienda t ON r.id_tienda = t.id_tienda
                WHERE c.categoria = $1
                GROUP BY tr.id_tipo, tr.nombre
                HAVING COUNT(r.id_repuesto) > 0
                ORDER BY COUNT(r.id_repuesto) DESC, tr.nombre ASC
            `, [categoria]);
            return result.rows;
        } catch (error) {
            console.error('Error obteniendo tipos por categoría:', error);
            throw error;
        }
    }
};