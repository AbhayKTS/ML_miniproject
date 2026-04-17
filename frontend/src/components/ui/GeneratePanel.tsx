import React, { useState } from 'react';
import { useGenerate } from '../../hooks/useGenerate';

export const GeneratePanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { generate, loading, error } = useGenerate();

  const handleSubmit = async () => {
    const text = await generate(prompt);
    if (text) setResult(text);
  };

  return (
    <div className="generate-panel">
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
        placeholder="Enter your creative prompt..." />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {error && <p className="error">{error}</p>}
      {result && <div className="result">{result}</div>}
    </div>
  );
};
