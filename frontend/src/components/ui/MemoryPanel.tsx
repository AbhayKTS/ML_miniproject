import React from 'react';
import { useMemory } from '../../hooks/useMemory';

export const MemoryPanel: React.FC = () => {
  const { memory, clear } = useMemory();

  return (
    <div className="memory-panel">
      <h3>Creative Memory</h3>
      {Object.keys(memory).length === 0
        ? <p>No memory stored yet.</p>
        : <pre>{JSON.stringify(memory, null, 2)}</pre>
      }
      <button onClick={clear}>Clear Memory</button>
    </div>
  );
};
