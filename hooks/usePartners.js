import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export function usePartners() {
  const [partners, setPartners] = useState([]);
  const api = useApi();

  const fetchPartners = async () => {
    try {
      const data = await api.get('/api/partners');
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const createPartner = async (partnerData) => {
    try {
      const data = await api.post('/api/partners', partnerData);
      setPartners([data, ...partners]);
      return data;
    } catch (error) {
      console.error('Error creating partner:', error);
      throw error;
    }
  };

  const updatePartner = async (id, partnerData) => {
    try {
      const data = await api.put(`/api/partners/${id}`, partnerData);
      setPartners(partners.map(p => p._id === id ? data : p));
      return data;
    } catch (error) {
      console.error('Error updating partner:', error);
      throw error;
    }
  };

  const deletePartner = async (id) => {
    try {
      await api.delete(`/api/partners/${id}`);
      setPartners(partners.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting partner:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return {
    partners,
    loading: api.loading,
    error: api.error,
    createPartner,
    updatePartner,
    deletePartner,
    refreshPartners: fetchPartners,
  };
}
