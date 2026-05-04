import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    apiClient.get('/analytics').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <main className="analytics-page">
      <h1>Analytics</h1>
      <ul>
        {Object.entries(stats).map(([k, v]) => (
          <li key={k}><strong>{k}</strong>: {v}</li>
        ))}
      </ul>
    </main>
  );
};
