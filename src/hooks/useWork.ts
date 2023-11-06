import {useMemo} from 'react';
import {
  BeaconType as Beacon,
  ExhibitionType as Exhibition,
  WorkType as Work,
} from '../types';
import {sameMinor} from '../utils/beacon';

function findWorkByBeacon(works: Work[], beacon: Beacon): Work | undefined {
  return works.find((work: Work) => {
    return work.beacons?.some((workBeacon: Beacon) =>
      sameMinor(workBeacon, beacon),
    );
  });
}

export default function useWork(beacons: Beacon[], exhibitions: Exhibition[]) {
  const allWorks: Work[] = useMemo<Work[]>(() => {
    return exhibitions
      .map(({beacons: _, products, ...exhibition}) =>
        products?.map(work => ({...work, exhibition})),
      )
      .flat()
      .filter(work => work !== undefined) as Work[];
  }, [exhibitions]);

  return useMemo(() => {
    return beacons
      .map(beacon => {
        const foundWork = findWorkByBeacon(allWorks, beacon);
        if (!foundWork) {
          return undefined;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {beacons: _, ...work} = foundWork;
        return {...work, beacon};
      })
      .filter(work => work !== undefined)
      .filter(
        (work, index, works) =>
          works.findIndex(w => w?.id === work?.id) === index,
      ) as Work[];
  }, [beacons, allWorks]);
}
