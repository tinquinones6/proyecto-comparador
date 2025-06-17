import { useEffect, useState } from 'react';
import api from '../config/api';

function Perfil() {
  const [usuario, setUsuario] = useState({ nombre: '', email: '', rol: '' });
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '' });

  const [favoritos, setFavoritos] = useState([]);
  const [nuevoFavorito, setNuevoFavorito] = useState({ marca: '', modelo: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPerfil();
    fetchFavoritos();
  }, []);

  const fetchPerfil = async () => {
    try {
      const res = await api.get('/auth/perfil', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuario(res.data);
      setFormData({ nombre: res.data.nombre, email: res.data.email });
    } catch (err) {
      console.error('Error al obtener perfil:', err);
    }
  };

  const fetchFavoritos = async () => {
    try {
      const res = await api.get('/favoritos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritos(res.data);
    } catch (err) {
      console.error('Error al obtener favoritos:', err);
    }
  };

  const guardarCambios = async () => {
    try {
      const res = await api.put('/auth/perfil', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuario(res.data);
      setEditando(false);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  };

  const agregarFavorito = async () => {
    try {
      const res = await api.post(
        '/favoritos',
        nuevoFavorito,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavoritos([...favoritos, res.data]);
      setNuevoFavorito({ marca: '', modelo: '' });
    } catch (err) {
      console.error('Error al agregar favorito:', err);
    }
  };

  const eliminarFavorito = async (id) => {
    try {
      await api.delete(`/favoritos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritos(favoritos.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error al eliminar favorito:', err);
    }
  };

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>

      {!editando ? (
        <>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
          <button onClick={() => setEditando(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Editar</button>
        </>
      ) : (
        <>
          <input name="nombre" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="block mb-2 border px-2 py-1" />
          <input name="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="block mb-2 border px-2 py-1" />
          <button onClick={guardarCambios} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Guardar</button>
          <button onClick={() => setEditando(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
        </>
      )}

      {/* FAVORITOS */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Mis Favoritos (Marcas y Modelos)</h3>

        {favoritos.length === 0 && <p className="text-gray-500">No tienes favoritos guardados.</p>}

        <ul className="mb-4">
          {favoritos.map(f => (
            <li key={f.id} className="flex items-center justify-between bg-white border px-3 py-2 mb-2 rounded">
              <span>{f.marca} - {f.modelo}</span>
              <button onClick={() => eliminarFavorito(f.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <input type="text" placeholder="Marca" value={nuevoFavorito.marca} onChange={e => setNuevoFavorito({ ...nuevoFavorito, marca: e.target.value })} className="border px-2 py-1 rounded" />
          <input type="text" placeholder="Modelo" value={nuevoFavorito.modelo} onChange={e => setNuevoFavorito({ ...nuevoFavorito, modelo: e.target.value })} className="border px-2 py-1 rounded" />
          <button onClick={agregarFavorito} className="bg-blue-600 text-white px-4 py-1 rounded">Agregar</button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;