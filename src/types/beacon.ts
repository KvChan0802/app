export interface BeaconType {
  uuid: string;
  major?: number;
  minor?: number;
  rssi?: number;
  distance?: number;
  accuracy?: number;
  proximity?: string;
}
