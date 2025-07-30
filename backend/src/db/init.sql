-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente'
);

-- Crear tabla de repuestos si no existe
CREATE TABLE IF NOT EXISTS repuestos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    tienda VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL DEFAULT 'Sin categoría'
);

-- Crear tabla de favoritos si no existe
CREATE TABLE IF NOT EXISTS favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL
); 