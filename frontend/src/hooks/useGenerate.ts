import { useState } from 'react';
import apiClient from '../utils/apiClient';

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (prompt: string): Promise<string | null> => {
    setLoading(true); setError(null);
    try {
      const { data } = await apiClient.post('/generate/text', { prompt });
      return data.text;
    } catch (e: any) {
      setError(e.response?.data?.error || 'Generation failed');
      return null;
    } finally { setLoading(false); }
  };

  return { generate, loading, error };
}
