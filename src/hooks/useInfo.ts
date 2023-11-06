import {useEffect, useState} from 'react';

export interface Location {
  address: string;
  geolocation: {
    lat: number;
    lng: number;
  };
}

export interface Opening {
  order: number;
  day: string;
  hours: string;
  weekend: boolean;
}

export interface Access {
  order: number;
  method: string;
  description: string;
}

export interface Info {
  location: Location;
  opening: Opening[];
  access: Access[];
}

export default function useInfo(lang: string) {
  const [info, setInfo] = useState<Info | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!lang) {
      return;
    }

    fetch(`https://msc-guide-server-next-rho.vercel.app/api/info?lang=${lang}`)
      .then(response => response.json())
      .then(data => {
        setInfo(data);
        setLoading(false);
      });
  }, [lang]);

  return {info, loading};
}
