import React, { useState } from 'react';
import apiClient from '../../utils/apiClient';

export const FeedbackForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async () => {
    await apiClient.post('/feedback', { message });
    setSent(true); setMessage('');
  };

  return (
    <div className="feedback-form">
      {sent ? <p>Thanks for your feedback!</p> : (
        <>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Share your thoughts..." />
          <button onClick={submit} disabled={!message.trim()}>Submit</button>
        </>
      )}
    </div>
  );
};
