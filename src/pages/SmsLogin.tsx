import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

import Styles, {colors} from '../components/Styles';
import useNavigation from '../hooks/useNavigation';
import useSmsLogin from '../hooks/useSmsLogin';

// Tab: User
// SmsLogin: SMS 登入頁面
export default function SmsLogin() {
  const [phone, setPhone] = useState<string>('+853');
  const [code, setCode] = useState<string>('');
  const {state, error, login, verify} = useSmsLogin();

  const navigation = useNavigation();

  useEffect(() => {
    if (state === 'success') {
      navigation.goBack();
    }
  }, [navigation, state]);

  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <Text style={[Styles.title, styles.title]}>SMS Login</Text>

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        defaultValue={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Verification Code</Text>
      <TextInput
        style={styles.input}
        defaultValue={code}
        onChangeText={setCode}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
      />

      {!['idle', 'loading-code'].includes(state) && (
        <Button
          title={state === 'loading-verify' ? 'Loading...' : 'Verify'}
          disabled={state === 'loading-verify'}
          onPress={() => verify(code)}
        />
      )}

      {['idle', 'loading-code'].includes(state) && (
        <Button
          title={state === 'loading-code' ? 'Loading...' : 'Login'}
          disabled={state === 'loading-code'}
          onPress={() => login(phone)}
        />
      )}

      <Text style={styles.error}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    display: 'flex',
    alignItems: 'flex-start',
  },
  title: {
    textAlign: 'center',
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    fontSize: 16,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: colors.disabled,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  grow: {
    flexGrow: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '100%',
  },
  error: {
    color: colors.contrast,
    marginTop: 16,
  },
});
