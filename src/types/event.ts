import {BeaconType} from './index';

export interface Event {
  id: string;
  name: string;
  available_at: string;
  start_at: string;
  end_at: string;
  beacons: BeaconType[];
}
