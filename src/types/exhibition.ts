import {BeaconType, WorkType} from './index';

export interface ExhibitionType {
  id: string;
  code: string;
  name?: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  note?: string;
  noteZh: string;
  noteEn: string;
  notePt: string;
  visible: boolean;
  featureImage: string;
  images: string[];
  works?: WorkType[];
  products?: WorkType[];
  beacons?: BeaconType[];
}
