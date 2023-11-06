import {useEffect, useState} from 'react';
import {BeaconType} from '../types';

interface ReturnProps {
  isInMSC: boolean;
}

export default function useMSC(beacons: BeaconType[]): ReturnProps {
  const [isInMSC, setIsInMSC] = useState<boolean>(false);

  useEffect(() => {
    setIsInMSC(() => {
      return beacons.some(beacon => {
        return (
          beacon.uuid.toLowerCase() ===
          'B5B182C7-EAB1-4988-AA99-B5C1517008D9'.toLowerCase()
        );
      });
    });
  }, [beacons]);

  return {
    isInMSC,
  };
}
