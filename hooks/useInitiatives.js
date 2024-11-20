import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export function useInitiatives() {
  const [initiatives, setInitiatives] = useState([]);
  const api = useApi();

  const fetchInitiatives = async () => {
    try {
      const data = await api.get('/api/initiatives');
      setInitiatives(data);
    } catch (error) {
      console.error('Error fetching initiatives:', error);
    }
  };

  const createInitiative = async (initiativeData) => {
    try {
      const data = await api.post('/api/initiatives', initiativeData);
      setInitiatives([data, ...initiatives]);
      return data;
    } catch (error) {
      console.error('Error creating initiative:', error);
      throw error;
    }
  };

  const updateInitiative = async (id, initiativeData) => {
    try {
      const data = await api.put(`/api/initiatives/${id}`, initiativeData);
      setInitiatives(initiatives.map(i => i._id === id ? data : i));
      return data;
    } catch (error) {
      console.error('Error updating initiative:', error);
      throw error;
    }
  };

  const deleteInitiative = async (id) => {
    try {
      await api.delete(`/api/initiatives/${id}`);
      setInitiatives(initiatives.filter(i => i._id !== id));
    } catch (error) {
      console.error('Error deleting initiative:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchInitiatives();
  }, []);

  return {
    initiatives,
    loading: api.loading,
    error: api.error,
    createInitiative,
    updateInitiative,
    deleteInitiative,
    refreshInitiatives: fetchInitiatives,
  };
}
