import {useEffect, useRef, useState} from 'react';
import {EmitterSubscription, PermissionsAndroid} from 'react-native';
import {useTranslation} from 'react-i18next';
import Beacons from 'react-native-beacons-manager';

import useBeaconState from './useBeaconState';
import useLocationPermission from './useLocationPermission';
import useNotification from './useNotification';

import {BeaconType as Beacon} from '../types';

// beacons data 來源 useBeaconState
// - useBeaconState 的更新會導致 useBeacon 的更新
// - useBeacon 的更新會導致其他的更新

// useBeacon 的用途
// 1. 更新 BeaconContext.Provider, 讓整個 App.tsx 都 rerender, 有用上 useContext(BeaconContext) 的 components 都會 rerender
// 2. 給其他用上 useBeacon 的 component rerender
export default function useBeacon(): Beacon[] {
  const [region] = useState({
    identifier: 'macau-science-center',
    uuid: 'B5B182C7-EAB1-4988-AA99-B5C1517008D9',
  });
  const {requestPermission} = useLocationPermission();

  const subs = useRef<EmitterSubscription[]>([]);
  const [beacons, setBeacons] = useBeaconState(10);

  const {localNotification} = useNotification();
  const {t} = useTranslation();

  async function handlePermission() {
    await requestPermission(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      'Beacons Manager',
      'We need your permission.',
    );
    await requestPermission(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      'Beacons Manager',
      'We need your permission.',
    );

    Beacons.detectIBeacons();

    try {
      await Beacons.startRangingBeaconsInRegion(region);
      await Beacons.startMonitoringForRegion(region);
    } catch (error) {
      console.warn('Error occured while ranging beacons.', error);
    }
  }

  function addRegionListener() {
    const Emitter = Beacons.BeaconsEventEmitter;

    subs.current = [
      Beacons.BeaconsEventEmitter.addListener(
        'beaconsDidRange',
        (data: any) => {
          setBeacons(data.beacons);
        },
      ),

      Beacons.BeaconsEventEmitter.addListener('regionDidEnter', (data: any) => {
        if (data.identifier === 'macau-science-center') {
          localNotification({
            title: `${t('msc.title')}`,
            message: `${t('msc.welcome')}`,
          });
        }
      }),

      Beacons.BeaconsEventEmitter.addListener('regionDidExit', (data: any) => {
        if (data.identifier === 'macau-science-center') {
          localNotification({
            title: `${t('msc.title')}`,
            message: `${t('msc.bye')}`,
          });
        }
      }),

      Emitter.addListener('authorizationStatusDidChange', (data: string) => {
        (async () => {
          if (data === 'notDetermined') {
            Beacons.requestWhenInUseAuthorization();
          } else if (data === 'authorizedWhenInUse') {
            await Beacons.startRangingBeaconsInRegion(region);
            await Beacons.startUpdatingLocation();

            Beacons.requestAlwaysAuthorization();
          } else if (data === 'authorizedAlways') {
            await Beacons.startRangingBeaconsInRegion(region);
            await Beacons.startMonitoringForRegion(region);
            await Beacons.startUpdatingLocation();
          }
        })();
      }),
    ];
  }

  function removeBeaconSubscription() {
    subs.current?.map(sub => sub.remove());
  }

  useEffect(() => {
    removeBeaconSubscription();
    addRegionListener();

    handlePermission();

    return () => {
      removeBeaconSubscription();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return beacons;
}
