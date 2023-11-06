import {useEffect} from 'react';
import {Platform} from 'react-native';
import PushNotification, {
  PushNotificationObject,
  PushNotificationScheduleObject,
} from 'react-native-push-notification';

export default function useNotification() {
  function localNotification(options: PushNotificationObject) {
    PushNotification.localNotification({
      channelId: 'msc-channel',
      ...options,
    });
  }

  function scheduleNotification(options: PushNotificationScheduleObject) {
    PushNotification.localNotificationSchedule({
      channelId: 'msc-channel',
      repeatTime: 1,
      ...options,
    });
  }

  function cancelNotification(id: string) {
    PushNotification.cancelLocalNotification(id);
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'msc-channel',
          channelName: 'Macau Science Center',
        },
        () => {},
      );
    }
  }, []);

  return {
    localNotification,
    scheduleNotification,
    cancelNotification,
  };
}
