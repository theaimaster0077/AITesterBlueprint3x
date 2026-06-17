import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './index.css';

function App() {
  const [issueKey, setIssueKey] = useState('SCRUM-6');
  const [loading, setLoading] = useState(false);
  const [testPlan, setTestPlan] = useState('');
  const [error, setError] = useState('');

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    setTestPlan('');

    try {
      // Use VITE_API_URL if set, otherwise use relative path in production, or local Express port
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');
      const endpoint = `${apiUrl}/api/generate-plan`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueKey })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate test plan');
      }

      setTestPlan(data.payload);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🚀 B.L.A.S.T. Jira Test Plan Agent</h1>
        <p>Enter a Jira ticket ID below to automatically fetch context and generate a strict RICE-POT QA document.</p>
      </header>

      <main>
        <div className="input-group">
          <input type="text" value={issueKey} onChange={(e) => setIssueKey(e.target.value)} placeholder="Enter Jira Key (e.g., SCRUM-6)" />
          <button onClick={generatePlan} disabled={loading || !issueKey}>{loading ? 'Generating...' : 'Generate Plan'}</button>
        </div>
        {error && <div className="error">{error}</div>}
        {testPlan && (
          <div className="results">
            <div className="markdown-body">
              <ReactMarkdown>{testPlan}</ReactMarkdown>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;