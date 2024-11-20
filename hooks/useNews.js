import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export function useNews() {
  const [news, setNews] = useState([]);
  const api = useApi();

  const fetchNews = async () => {
    try {
      const data = await api.get('/api/news');
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const createNews = async (newsData) => {
    try {
      const data = await api.post('/api/news', newsData);
      setNews([data, ...news]);
      return data;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  };

  const updateNews = async (id, newsData) => {
    try {
      const data = await api.put(`/api/news/${id}`, newsData);
      setNews(news.map(n => n._id === id ? data : n));
      return data;
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  };

  const deleteNews = async (id) => {
    try {
      await api.delete(`/api/news/${id}`);
      setNews(news.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading: api.loading,
    error: api.error,
    createNews,
    updateNews,
    deleteNews,
    refreshNews: fetchNews,
  };
}
