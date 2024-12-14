import { useState } from 'react';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url, options = {}) => {
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      body: options.body instanceof FormData ? '[FormData]' : options.body,
    });

    try {
      setLoading(true);
      setError(null);

      // Don't set Content-Type for FormData, let the browser handle it
      const headers = options.body instanceof FormData
        ? options.headers
        : {
            'Content-Type': 'application/json',
            ...options.headers,
          };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();
      console.log('API Response:', {
        status: response.status,
        data,
      });
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      return data;
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = (url) => fetchData(url);

  const post = (url, data) => {
    console.log('POST Request Data:', data instanceof FormData ? '[FormData]' : data);
    return fetchData(url, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  };

  const put = (url, data) => {
    console.log('PUT Request Data:', data instanceof FormData ? '[FormData]' : data);
    return fetchData(url, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  };

  const del = (url) => fetchData(url, { method: 'DELETE' });

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
}
