/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EnvelopeIcon} from 'react-native-heroicons/outline';
import {useTranslation} from 'react-i18next';

import {MessageType} from '../types';

import useNavigation from '../hooks/useNavigation';
import Languages from '../pages/Languages';
import Message from '../pages/Message';
import Messages from '../pages/Messages';
import UserInfo from '../pages/UserInfo';
import UserLogin from '../pages/UserLogin';
import EmailLogin from '../pages/EmailLogin';
import SmsLogin from '../pages/SmsLogin';

export type RootStackParamList = {
  EmailLogin: undefined;
  Languages: undefined;
  Message: {
    message: MessageType;
  };
  Messages: undefined;
  SmsLogin: undefined;
  UserInfo: undefined;
  UserLogin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 帳戶頁面
// 即第四個 tab 的頁面
// UserInfo： 帳戶頁面
// UserLogin： 登入頁面
// EmailLogin： 信箱登入頁面
// SmsLogin： 簡訊登入頁面
// Languages： 語言設定頁面
// Messages： 訊息列表頁面
// Message： 訊息內容頁面
export default function User() {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserInfo"
        component={UserInfo}
        options={{
          headerTitle: `${t('profile.title')}`,
          headerBackVisible: false,
          headerRight: ({tintColor}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Messages')}
              style={styles.iconContainer}
              accessibilityLabel={`${t('profile.messages.title')}`}
              accessibilityRole="button">
              <EnvelopeIcon size={24} color={tintColor} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="UserLogin"
        component={UserLogin}
        options={{
          headerTitle: `${t('profile.login.title')}`,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EmailLogin"
        component={EmailLogin}
        options={{
          headerTitle: `${t('profile.login.password')}`,
        }}
      />
      <Stack.Screen
        name="SmsLogin"
        component={SmsLogin}
        options={{
          headerTitle: `${t('profile.login.password')}`,
        }}
      />
      <Stack.Screen
        name="Languages"
        component={Languages}
        options={{headerTitle: `${t('profile.languages.select')}`}}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{headerTitle: `${t('profile.messages.message')}`}}
      />
      <Stack.Screen
        name="Message"
        component={Message}
        options={{headerTitle: ''}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
    margin: -8,
  },
});
