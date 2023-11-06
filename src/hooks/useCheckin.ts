import {useEffect, useState} from 'react';

import {sameMinor} from '../utils/beacon';
import {BeaconType, Event} from '../types';

interface ReturnType {
  events: Event[];
}

export default function useCheckin(
  beacons: BeaconType[],
  language: string,
): ReturnType {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  async function fetchEvents() {
    const domain = 'https://msc-guide-server-next-rho.vercel.app';
    const url = `${domain}/api/checkin?lang=${language}`;
    const res = await fetch(url);
    const json = await res.json();
    return json as Event[];
  }

  function intersect(a: BeaconType[], b: BeaconType[]) {
    return a.filter(x => b.some(y => sameMinor(x, y)));
  }

  useEffect(() => {
    const filtered = allEvents.filter(
      e => intersect(e.beacons, beacons).length > 0,
    );
    setEvents(filtered);
  }, [allEvents, beacons]);

  useEffect(() => {
    async function exec() {
      const response = await fetchEvents();
      setAllEvents(response);
    }

    exec();
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    events,
  };
}
