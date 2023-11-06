import {BeaconType} from '../types';

export function sameUUID(a: BeaconType, b: BeaconType) {
  return a.uuid.toLowerCase() === b.uuid.toLowerCase();
}

export function sameMajor(a: BeaconType, b: BeaconType) {
  // return sameUUID(a, b) && a.major === b.major;
  return a.major === b.major;
}

export function sameMinor(a: BeaconType, b: BeaconType) {
  return sameMajor(a, b) && a.minor === b.minor;
}
