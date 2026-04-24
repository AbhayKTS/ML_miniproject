import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient';

interface Project { id: string; title: string; createdAt: string; }

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    apiClient.get('/projects').then(r => setProjects(r.data)).catch(() => {});
  }, []);

  return (
    <main className="projects-page">
      <h1>My Projects</h1>
      {projects.length === 0 && <p>No projects yet. Start creating!</p>}
      <ul>{projects.map(p => <li key={p.id}>{p.title}</li>)}</ul>
    </main>
  );
};
