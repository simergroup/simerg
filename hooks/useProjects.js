import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  const fetchProjects = async () => {
    try {
      const data = await api.get('/api/projects');
      console.log('Fetched projects:', data);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    console.log('Creating project with data:', projectData);
    try {
      const data = await api.post('/api/projects', projectData);
      console.log('Create project response:', data);
      setProjects([data, ...projects]);
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const updateProject = async (id, projectData) => {
    console.log('Updating project with ID:', id, 'Data:', projectData);
    try {
      const data = await api.put(`/api/projects/${id}`, projectData);
      console.log('Update project response:', data);
      setProjects(projects.map(p => p._id === id ? data : p));
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}
