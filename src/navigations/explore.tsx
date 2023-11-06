import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {TicketIcon} from 'react-native-heroicons/outline';

import Checkin from '../pages/Checkin';
import Explore from '../pages/Explore';
import Tickets from '../pages/Tickets';
import Reservations from '../pages/Reservations';
import Work from '../pages/Work';

import {colors} from '../components/Styles';
import {Event, ExhibitionType, WorkType} from '../types';

export type RootStackParamList = {
  Explore: undefined;
  Tickets: {
    exhibition: ExhibitionType;
  };
  Reservations: undefined;
  Checkin: {
    event: Event;
  };
  Work: {
    work: WorkType;
    exhibition: ExhibitionType;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 探索頁面
// 即第三個 tab 的頁面
// Explore： 探索頁面
// Tickets： 取籌頁面
// Reservations： 我的預約籌
// Checkin： 簽到頁面
// Work： 作品內容 (Explore 時找到展品可以看他們的詳細內容)
export default function ExploreNav() {
  const {t} = useTranslation();

  // ExploreNav 的頁面
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Explore"
        component={Explore}
        options={{
          title: t('explore.title') || 'Explore',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Tickets"
        component={Tickets}
        options={({navigation}) => ({
          title: t('explore.tickets.get') || 'Tickets',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: ({tintColor}) => (
            <MyTicketsIcon navigation={navigation} color={tintColor} />
          ),
        })}
      />
      <Stack.Screen
        name="Reservations"
        component={Reservations}
        options={{
          title: t('explore.tickets.my-reservations') || 'Reservations',
        }}
      />
      <Stack.Screen
        name="Checkin"
        component={Checkin}
        options={{
          title: t('explore.checkin.title') || 'Check-in',
        }}
      />
      <Stack.Screen name="Work" component={Work} />
    </Stack.Navigator>
  );
}

function MyTicketsIcon({
  navigation,
  color = colors.primary,
}: {
  navigation: any;
  color: string | undefined;
}) {
  return (
    <TicketIcon
      // style={{marginRight: 10}}
      size={30}
      color={color}
      onPress={() => navigation.navigate('Reservations')}
    />
  );
}
