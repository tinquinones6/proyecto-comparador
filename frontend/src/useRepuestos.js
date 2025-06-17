import { useState, useEffect } from 'react';
import api from './config/api';

export function useRepuestos() {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/repuestos')
      .then((response) => {
        setRepuestos(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { repuestos, loading, error };
}