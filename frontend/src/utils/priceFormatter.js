// Función universal para formatear precios chilenos (sin decimales)
export const formatearPrecioCLP = (precio) => {
  if (!precio && precio !== 0) return 'Consultar precio';
  
  // Asegurar que sea un número
  const numeroLimpio = typeof precio === 'string' ? parseFloat(precio) : precio;
  
  if (isNaN(numeroLimpio)) {
    console.warn('Precio inválido recibido:', precio);
    return 'Precio no disponible';
  }
  
  // Formatear como entero (sin decimales) para CLP
  const precioFormateado = Math.round(numeroLimpio).toLocaleString('es-CL');
  return `$${precioFormateado}`;
};

// Función para comparar precios (asegurar comparación numérica)
export const compararPrecios = (precio1, precio2) => {
  const p1 = typeof precio1 === 'string' ? parseFloat(precio1) : precio1;
  const p2 = typeof precio2 === 'string' ? parseFloat(precio2) : precio2;
  
  return p1 - p2;
};

// Función para obtener el producto más barato de una lista
export const obtenerMasBarato = (productos) => {
  if (!productos || productos.length === 0) return null;
  
  return productos.reduce((min, current) => {
    const precioMin = typeof min.precio === 'string' ? parseFloat(min.precio) : min.precio;
    const precioCurrent = typeof current.precio === 'string' ? parseFloat(current.precio) : current.precio;
    
    // Validar que ambos precios sean números válidos
    if (isNaN(precioMin) || isNaN(precioCurrent)) {
      console.warn('Precio inválido encontrado:', { min: min.precio, current: current.precio });
      return min;
    }
    
    return precioCurrent < precioMin ? current : min;
  });
};
