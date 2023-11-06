import {useEffect, useRef, useState} from 'react';
import {BeaconType} from '../types';

type UseBeaconStateProps = [BeaconType[], (args: BeaconType[]) => void];

export default function useBeaconState(
  bufferSize: number = 5,
): UseBeaconStateProps {
  const [samples, _setSamples] = useState<BeaconType[][]>([]);
  const [state, _setState] = useState<BeaconType[]>([]);
  const lastUpdate = useRef<number>(0);

  function setState(update: BeaconType[]) {
    addToSamples(update);
  }

  function addToSamples(update: BeaconType[]) {
    _setSamples((current: BeaconType[][]) =>
      [update, ...current].slice(0, bufferSize),
    );
  }

  function processSamples(): BeaconType[] {
    return samples
      .flat()
      .reduce((unique: BeaconType[], beacon: BeaconType) => {
        if (unique.some(_beacon => sameBeacon(beacon, _beacon))) {
          return unique;
        }

        return [
          ...unique,
          {uuid: beacon.uuid, major: beacon.major, minor: beacon.minor},
        ];
      }, [] as BeaconType[])
      .map((beacon: BeaconType) => ({
        ...beacon,
        ...samples
          .flat()
          .filter(_beacon => sameBeacon(beacon, _beacon))
          .reduce(
            (output, _beacon: BeaconType) => ({
              distance:
                output.distance +
                (_beacon.distance && _beacon.distance > 0
                  ? _beacon.distance
                  : 0),
              rssi: output.rssi + (_beacon.rssi ? _beacon.rssi : 0),
              count:
                output.count +
                (_beacon.distance && _beacon.distance > 0 ? 1 : 0),
            }),
            {distance: 0, rssi: 0, count: 0},
          ),
      }))
      .filter(beacon => beacon.count !== 0)
      .map(beacon => ({
        ...beacon,
        distance: Math.round((beacon.distance / beacon.count) * 100) / 100,
        rssi: Math.round(beacon.rssi / beacon.count),
        count: undefined,
      }))
      .sort((a, b) => (a.distance > b.distance ? 1 : -1));
  }

  function sameBeacon(one: BeaconType, another: BeaconType) {
    return one.major === another.major && one.minor === another.minor;
  }

  useEffect(() => {
    if (Date.now() - lastUpdate.current > 3000) {
      _setState(processSamples());
      lastUpdate.current = Date.now();
    }
  }, [samples]); // eslint-disable-line react-hooks/exhaustive-deps

  return [state, setState];
}
