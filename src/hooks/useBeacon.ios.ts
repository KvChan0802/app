import {useEffect, useRef, useState} from 'react';
import {AppState, EmitterSubscription} from 'react-native';
import {useTranslation} from 'react-i18next';
import Beacons from 'react-native-beacons-manager';

import useBeaconState from './useBeaconState';
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
  const [beacons, setBeacons] = useBeaconState();

  const subs = useRef<EmitterSubscription[]>([]);
  const {localNotification} = useNotification();
  const {t} = useTranslation();

  async function handlePermission(permission: string) {
    if (permission === 'notDetermined') {
      Beacons.requestWhenInUseAuthorization();
    } else if (permission === 'authorizedWhenInUse') {
      await Beacons.startRangingBeaconsInRegion(region);
      await Beacons.startUpdatingLocation();

      Beacons.requestAlwaysAuthorization();
    } else if (permission === 'authorizedAlways') {
      await Beacons.startRangingBeaconsInRegion(region);
      await Beacons.startMonitoringForRegion(region);
      await Beacons.startUpdatingLocation();
    }
  }

  function addRegionListener() {
    const Emitter = Beacons.BeaconsEventEmitter;

    subs.current = [
      Emitter.addListener('beaconsDidRange', (data: any) => {
        setBeacons(data.beacons);
      }),

      Emitter.addListener('regionDidEnter', (data: any) => {
        if (data.identifier === 'macau-science-center') {
          localNotification({
            title: `${t('msc.title')}`,
            message: `${t('msc.welcome')}`,
          });
        }
      }),

      Emitter.addListener('regionDidExit', (data: any) => {
        if (data.identifier === 'macau-science-center') {
          localNotification({
            title: `${t('msc.title')}`,
            message: `${t('msc.bye')}`,
          });
        }
      }),

      Emitter.addListener('authorizationStatusDidChange', (data: string) => {
        console.log('authorizationStatusDidChange', data);
        handlePermission(data);
      }),
    ];
  }

  function removeRegionListener() {
    subs.current?.map(sub => sub.remove());
  }

  useEffect(() => {
    removeRegionListener();
    addRegionListener();

    const appState = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        Beacons.startRangingBeaconsInRegion(region);
      } else if (nextAppState === 'background') {
        Beacons.stopRangingBeaconsInRegion(region);
      }
    });

    Beacons.getAuthorizationStatus(permission => {
      handlePermission(permission);
    });

    return () => {
      removeRegionListener();
      appState.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return beacons;
}
