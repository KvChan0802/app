import {useEffect, useState} from 'react';
import type {NewsType} from '../types/news';

export default function useNews(lang: string) {
  const [data, setData] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function handle() {
      setLoading(true);
      const base = 'https://msc-guide-server-next-rho.vercel.app';

      try {
        setLoading(true);
        const res = await fetch(`${base}/api/news?lang=${lang}`);

        if (res.status !== 200) {
          throw new Error('Error fetching news');
        }

        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (lang) {
      handle();
    }
  }, [lang]);

  return {data, loading};
}
