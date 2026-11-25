import { useState, useEffect, useCallback } from 'react';
import ragService from '../services/ragService';

export function useSystemStatus() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const [hData, sData] = await Promise.all([
        ragService.getHealth(),
        ragService.getStats(),
      ]);
      setHealth(hData);
      setStats(sData);
      setError(null);
    } catch (err) {
      console.warn('Could not fetch system status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 20000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { health, stats, loading, error, refresh };
}
