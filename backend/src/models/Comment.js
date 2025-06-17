const pool = require('../db');

const commentModel = {
    // Crear un nuevo comentario
    createComment: async (repuestoId, mensaje, tipo) => {
        const query = `
            INSERT INTO comentarios (repuesto_id, mensaje, tipo)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [repuestoId, mensaje, tipo]);
        return result.rows[0];
    },

    // Obtener comentarios por repuesto
    getCommentsBySparepart: async (repuestoId) => {
        const query = `
            SELECT c.*, r.nombre as repuesto_nombre
            FROM comentarios c
            JOIN repuestos r ON c.repuesto_id = r.id
            WHERE c.repuesto_id = $1
            ORDER BY c.fecha_creacion DESC
        `;
        const result = await pool.query(query, [repuestoId]);
        return result.rows;
    },

    // Obtener todos los comentarios (para administradores)
    getAllComments: async () => {
        const query = `
            SELECT c.*, r.nombre as repuesto_nombre
            FROM comentarios c
            JOIN repuestos r ON c.repuesto_id = r.id
            ORDER BY c.fecha_creacion DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    // Actualizar estado y respuesta del comentario
    updateCommentStatus: async (commentId, estado, respuestaAdmin) => {
        const query = `
            UPDATE comentarios
            SET estado = $1, respuesta_admin = $2
            WHERE id = $3
            RETURNING *
        `;
        const result = await pool.query(query, [estado, respuestaAdmin, commentId]);
        return result.rows[0];
    },

    // Eliminar un comentario
    deleteComment: async (commentId) => {
        const query = `
            DELETE FROM comentarios
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [commentId]);
        return result.rows[0];
    }
};

module.exports = commentModel; 