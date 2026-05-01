import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';

export interface Project { id: string; title: string; createdAt: string; }

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    setLoading(true);
    apiClient.get('/projects')
      .then(r => setProjects(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const create = async (title: string) => {
    await apiClient.post('/projects', { title });
    fetchProjects();
  };

  return { projects, loading, create };
}
