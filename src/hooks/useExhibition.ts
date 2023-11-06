/* eslint-disable prettier/prettier */
import {useEffect, useState} from 'react';
import {BeaconType as Beacon, ExhibitionType as Exhibition} from '../types';
import {sameMajor} from '../utils/beacon';

export default function useExhibition(
  beacons: Beacon[],
  allExhibitions: Exhibition[],
): Exhibition[] {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  function matchBeaconExhibition(
    beacon: Beacon,
    exhibition: Exhibition,
  ): boolean {
    if (exhibition.products === null || exhibition.products === undefined) {
      return false;
    }

    return exhibition.products.some(product => {
      return product.beacons && product.beacons.some((_beacon: Beacon) => {
        return (
          _beacon.uuid.toLowerCase() === beacon.uuid.toLowerCase() &&
          _beacon.major === beacon.major
        );
      });
    });
  }

  function uniqueBeaconMajorFromBeacons(_beacons: Beacon[]) {
    return _beacons.reduce((output: Beacon[], beacon: Beacon) => {
      if (output.some(_beacon => sameMajor(_beacon, beacon))) {
        return output;
      }

      return [...output, {uuid: beacon.uuid, major: beacon.major}];
    }, []);
  }

  useEffect(() => {
    setExhibitions(() => {
      return uniqueBeaconMajorFromBeacons(beacons)
        .map(beacon => {
          const exhibition = allExhibitions.find(_exhibition => {
            return matchBeaconExhibition(beacon, _exhibition);
          });

          return exhibition;
        })
        .filter(exhibition => exhibition !== undefined) as Exhibition[];
    });
  }, [beacons, allExhibitions]);

  return exhibitions;
}
