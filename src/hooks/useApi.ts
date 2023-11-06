import {useCallback, useEffect, useState} from 'react';
import Error from '../types/error';

export interface UseApiReturnTypes<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export default function useApi<T>(
  url: string,
  options: object = {},
): UseApiReturnTypes<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function handle() {
    const base = 'https://msc-guide-server-next-rho.vercel.app';
    let json = null;

    try {
      setError(null);
      setLoading(true);

      const res = await fetch(`${base}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
        ...options,
      });
      json = await res.json();

      if (res.status !== 200) {
        throw new Error(json);
      }

      return json;
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setData(json as T);
      setLoading(false);
    }
  }

  const cached = useCallback(handle, [url, options]);

  useEffect(() => {
    cached();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {data, error, loading};
}
