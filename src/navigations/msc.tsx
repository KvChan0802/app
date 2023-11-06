import React, {useContext, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import useNavigation from '../hooks/useNavigation';

import Home from '../pages/Home';
import News from '../pages/News';
import NewsContent from '../pages/NewsContent';
import Questionnaire from '../pages/Questionnaire';

import useMSC from '../hooks/useMSC';
import {NewsType} from '../types';
import BeaconContext from '../context/BeaconContext';

export type RootStackParamList = {
  Home: undefined;
  News: undefined;
  NewsContent: {
    news: NewsType;
  };
  Questionnaire: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 首頁
// 即第一個 tab 的頁面
export default function MSC() {
  // 用來轉去其他頁面用
  const navigation = useNavigation();

  // 用來判斷是否在 MSC 內, 給 useMSC 用的
  const {beacons} = useContext(BeaconContext);

  // 用來判斷是否在 MSC 內
  const {isInMSC} = useMSC(beacons);

  // 用來判斷是否已經填過問卷, 拿取最後一次填問卷的時間
  const {getItem} = useAsyncStorage('@questionnaire');

  async function init() {
    // 先讀取現在的時間
    const now = new Date().getTime();
    // 讀取今日的時間，去掉時分秒
    const today = now - (now % 86400000);
    // 拿取最後一次填問卷的時間
    const last = await getItem();
    // 如果有上次填過問卷的時間, 看看是不是今天，存到 lastDateIsNotToday
    const lastDateIsNotToday = last && parseInt(last, 10) !== today;
    // 如果沒有上次填過問卷的時間，或是上次填過問卷的時間不是今天，且在 MSC 內
    // 就轉去問卷頁面
    // 一開始 isInMSC 是 false
    // 然後拿到 beacons 的資料後，會更新 isInMSC
    // 然後會再執行多一次 init
    if ((!last || lastDateIsNotToday) && isInMSC) {
      navigation.navigate('Questionnaire');
    }
  }

  useEffect(() => {
    init();
  }, [isInMSC, navigation]); // eslint-disable-line react-hooks/exhaustive-deps

  // 首頁
  // 按了新聞的「更多」後，會轉去 News 頁面
  // 按了新聞後，會轉去 NewsContent 頁面 (只有 android, ios 會直接轉去網頁 app)
  // 如果上面判斷需要填問卷, 就會轉去 Questionnaire 頁面
  // Home: 首頁
  // News: 新聞頁面
  // NewsContent: 新聞內容頁面
  // Questionnaire: 問卷頁面
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="News"
        component={News}
        options={{headerTitle: '最新消息'}}
      />
      <Stack.Screen name="NewsContent" component={NewsContent} />
      <Stack.Screen
        name="Questionnaire"
        component={Questionnaire}
        options={{
          headerShown: false,
          presentation: 'formSheet',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
