import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import MyMSC from '../pages/MyMSC';
import Exhibition from '../pages/Exhibition';
import Work from '../pages/Work';
import {ExhibitionType, WorkType} from '../types';

export type RootStackParamList = {
  MyMSC: undefined;
  Exhibition: {
    exhibition: ExhibitionType;
  };
  Work: {
    work: WorkType;
    exhibition: ExhibitionType;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 我的 MSC 頁面
// 即第二個 tab 的頁面
// MyMSC： 展廳列表
// Exhibition： 展廳內容-作品列表
// Work： 作品內容 (要 available 才能按，即尋寶功能)
export default function MyMSCNav() {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyMSC"
        component={MyMSC}
        options={{title: `${t('mymsc.title')}`}}
      />
      <Stack.Screen name="Exhibition" component={Exhibition} />
      <Stack.Screen name="Work" component={Work} />
    </Stack.Navigator>
  );
}
