import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../components/Button';

interface UserLoginParams {}

// Tab: User
// UserLogin: 登入頁面
export default function UserLogin({}: UserLoginParams) {
  const {t} = useTranslation();

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <View style={styles.wrapper}>
        <Button title={t('profile.login.sms')} link="UserInfo" />
        <Button title={t('profile.login.google')} link="UserInfo" />
        <Button title={t('profile.login.facebook')} link="UserInfo" />
        <Button title={t('profile.login.wechat')} link="UserInfo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
});
