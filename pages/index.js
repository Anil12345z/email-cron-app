import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [cronStatus, setCronStatus] = useState('Stopped');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cron status and logs on mount
  useEffect(() => {
    fetchLogs();
    fetchStatus();
    // Poll logs every 5 seconds when cron is running
    const interval = setInterval(() => {
      if (cronStatus === 'Running') fetchLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [cronStatus]);

  // Fetch cron status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/cron/status');
      if (!res.ok) {
        const text = await res.text();
        setError(`Failed to fetch status: ${res.status} ${res.statusText} - ${text}`);
        console.error(`Fetch status failed: ${res.status} ${res.statusText}`, text);
        return;
      }
      const data = await res.json();
      setCronStatus(data.isRunning ? 'Running' : 'Stopped');
      setError(null);
    } catch (error) {
      setError(`Error fetching status: ${error.message}`);
      console.error('Error fetching status:', error);
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (!res.ok) {
        const text = await res.text();
        setError(`Failed to fetch logs: ${res.status} ${res.statusText} - ${text}`);
        console.error(`Fetch logs failed: ${res.status} ${res.statusText}`, text);
        return;
      }
      const data = await res.json();
      setLogs(data.logs);
      setError(null);
    } catch (error) {
      setError(`Error fetching logs: ${error.message}`);
      console.error('Error fetching logs:', error);
    }
  };

  // Toggle cron job
  const toggleCron = async () => {
    setIsLoading(true);
    try {
      const action = cronStatus === 'Running' ? 'stop' : 'start';
      const res = await fetch(`/api/cron/${action}`, { method: 'POST' });
      if (!res.ok) {
        const text = await res.text();
        setError(`Failed to toggle cron: ${res.status} ${res.statusText} - ${text}`);
        console.error(`Toggle cron failed: ${res.status} ${res.statusText}`, text);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setCronStatus(data.isRunning ? 'Running' : 'Stopped');
      await fetchLogs();
      setError(null);
    } catch (error) {
      setError(`Error toggling cron: ${error.message}`);
      console.error('Error toggling cron:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Email Cron Scheduler</title>
        <meta name="description" content="Control email cron job with a responsive UI" />
      </Head>
      <h1>Email Cron Scheduler</h1>
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
      <div className="status">
        <span>Status: </span>
        <span className={cronStatus === 'Running' ? 'running' : 'stopped'}>
          {cronStatus}
        </span>
      </div>
      <button onClick={toggleCron} disabled={isLoading}>
        {isLoading ? 'Processing...' : cronStatus === 'Running' ? 'Stop Cron' : 'Start Cron'}
      </button>
      <div className="logs">
        <h2>Logs</h2>
        {logs.length === 0 ? (
          <p>No logs available</p>
        ) : (
          <ul>
            {logs.map((log, index) => (
              <li key={index} className={log.includes('Error') ? 'error' : 'success'}>
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}