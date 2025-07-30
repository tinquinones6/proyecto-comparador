-- Verificar si la columna categoria existe y añadirla si no
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'repuestos'
        AND column_name = 'categoria'
    ) THEN
        ALTER TABLE repuestos
        ADD COLUMN categoria VARCHAR(100) NOT NULL DEFAULT 'Sin categoría';
    END IF;
END $$; 