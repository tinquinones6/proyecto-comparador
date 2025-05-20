import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Grid, TextField, Card, CardContent, CardActions,
  Typography, Button, Container, Divider, CardMedia
} from '@mui/material';

function Home() {
  const [repuestos, setRepuestos] = useState([]);
  const [filtro, setFiltro] = useState({ nombre: '', marca: '', modelo: '' });
  const [comparar, setComparar] = useState([]);

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const fetchRepuestos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/repuestos');
      setRepuestos(res.data);
    } catch (err) {
      console.error('Error al obtener repuestos', err);
    }
  };

  const agregarAComparacion = (repuesto) => {
    if (comparar.length >= 3) return;
    if (comparar.find(r => r.id === repuesto.id)) return;
    setComparar([...comparar, repuesto]);
  };

  const quitarDeComparacion = (id) => {
    setComparar(comparar.filter(r => r.id !== id));
  };

  const limpiarComparacion = () => setComparar([]);

  const filtrarRepuestos = repuestos.filter((r) =>
    r.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()) &&
    r.marca.toLowerCase().includes(filtro.marca.toLowerCase()) &&
    r.modelo.toLowerCase().includes(filtro.modelo.toLowerCase())
  );

  const imagenDefecto = 'https://via.placeholder.com/300x160.png?text=Sin+imagen';

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Comparador de Repuestos
      </Typography>

      {/* Comparación primero */}
      {comparar.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Comparando {comparar.length} repuesto(s)
          </Typography>

          <Grid container spacing={2}>
            {comparar.map((r) => (
              <Grid item xs={12} sm={4} key={r.id}>
                <Card sx={{ backgroundColor: '#f5f5f5' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={r.imagen_url || imagenDefecto}
                    alt={r.nombre}
                  />
                  <CardContent>
                    <Typography variant="h6">{r.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">{r.descripcion}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>Marca: {r.marca}</Typography>
                    <Typography variant="body2">Modelo: {r.modelo}</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      Precio: {r.precio} CLP
                    </Typography>
                    <Typography variant="body2">Tienda: {r.tienda}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => quitarDeComparacion(r.id)}
                    >
                      Quitar
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Comprar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="secondary" onClick={limpiarComparacion}>
              Limpiar comparación
            </Button>
          </Box>
          <Divider sx={{ my: 4 }} />
        </Box>
      )}

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Buscar por nombre"
            fullWidth
            value={filtro.nombre}
            onChange={(e) => setFiltro({ ...filtro, nombre: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Marca"
            fullWidth
            value={filtro.marca}
            onChange={(e) => setFiltro({ ...filtro, marca: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Modelo"
            fullWidth
            value={filtro.modelo}
            onChange={(e) => setFiltro({ ...filtro, modelo: e.target.value })}
          />
        </Grid>
      </Grid>

      {/* Resultados */}
      <Grid container spacing={2}>
        {filtrarRepuestos.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={r.imagen_url || imagenDefecto}
                alt={r.nombre}
              />
              <CardContent>
                <Typography variant="h6">{r.nombre}</Typography>
                <Typography variant="body2">Marca: {r.marca}</Typography>
                <Typography variant="body2">Modelo: {r.modelo}</Typography>
                <Typography variant="body2">Precio: {r.precio} CLP</Typography>
                <Typography variant="body2">Tienda: {r.tienda}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => agregarAComparacion(r)}
                  disabled={comparar.find((c) => c.id === r.id) || comparar.length >= 3}
                >
                  + Comparar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;