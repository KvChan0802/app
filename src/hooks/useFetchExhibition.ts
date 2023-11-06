import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ExhibitionType} from '../types';

export default function useFetchExhibition() {
  const [data, setData] = useState<ExhibitionType[]>([]);
  const [status, setStatus] = useState<string>('loading');
  const {i18n} = useTranslation();

  useEffect(() => {
    function getLangName(lang: string): string {
      return lang.charAt(0).toUpperCase() + lang.slice(1);
    }

    async function fetchData() {
      const {language} = i18n;
      const res = await fetch(
        'https://msc-guide-server-next-rho.vercel.app/api/exhibitions',
      );
      const json = await res.json();

      setData(
        json.map((exhibition: any) => ({
          ...exhibition,
          name: exhibition[`name${getLangName(language)}`],
          note: exhibition[`note${getLangName(language)}`],
          products: exhibition.products?.map((product: any) => ({
            ...product,
            name: product[`name${getLangName(language)}`],
            note: product[`note${getLangName(language)}`],
          })),
        })),
      );
      setStatus('fetched');
    }

    fetchData();

    i18n.on('languageChanged', fetchData);

    return () => {
      i18n.off('languageChanged', fetchData);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {data, status};
}
