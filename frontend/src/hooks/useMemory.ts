import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';

export function useMemory() {
  const [memory, setMemory] = useState<Record<string, any>>({});

  useEffect(() => {
    apiClient.get('/memory').then(r => setMemory(r.data)).catch(() => {});
  }, []);

  const save = (data: Record<string, any>) =>
    apiClient.post('/memory', data).then(r => setMemory(r.data));

  const clear = () =>
    apiClient.delete('/memory').then(() => setMemory({}));

  return { memory, save, clear };
}
