import { useCallback, useEffect, useState } from 'react';

interface UseAppwriteProps {
  fn: (params?: any) => Promise<any>;
  params?: any;
  skip?: boolean;
}

export const useAppwrite = ({ fn, params = {}, skip = false }: UseAppwriteProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (fetchParams: any) => {
    if (skip) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fn(fetchParams);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      console.error("Appwrite hook error:", err);
    } finally {
      setLoading(false);
    }
  }, [fn, skip]);

  useEffect(() => {
    fetchData(params);
  }, [JSON.stringify(params), skip, fetchData]);

  const refetch = useCallback((newParams?: any) => {
    fetchData(newParams || params);
  }, [fetchData, params]);

  return { data, loading, error, refetch };
};
