import {createContext} from 'react';
import {BeaconType} from '../types';

type BeaconContextType = {
  beacons: BeaconType[];
};

const BeaconContext = createContext<BeaconContextType>({
  beacons: [],
});

export default BeaconContext;
