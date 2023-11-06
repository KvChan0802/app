import {BeaconType, ExhibitionType} from './index';

export interface WorkType {
  id: number;
  name?: string;
  nameZh: string;
  nameEn: string;
  namePt: string;
  note?: string;
  noteZh: string;
  noteEn: string;
  notePt: string;
  featureImage: string;
  images: string[];
  visible: boolean;
  beacons?: BeaconType[];
  exhibition?: ExhibitionType;
}
