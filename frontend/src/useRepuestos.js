import { useState, useEffect } from 'react';
import axios from 'axios';

export function useRepuestos() {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/repuestos')
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