import {Permission, PermissionsAndroid} from 'react-native';

export default function useLocationPermission() {
  async function requestPermission(
    permission: Permission,
    title: string,
    message: string,
  ) {
    try {
      await PermissionsAndroid.request(permission, {
        title,
        message,
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   console.info('You can use the location');
      // } else {
      //   console.warn('location permission denied');
      // }
    } catch (err) {
      console.warn(err);
    }
  }

  return {
    requestPermission,
  };
}
