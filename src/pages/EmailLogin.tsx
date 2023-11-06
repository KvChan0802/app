import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Styles, {colors} from '../components/Styles';
import useNavigation from '../hooks/useNavigation';
import usePasswordLogin from '../hooks/usePasswordLogin';

// Tab: User
// EmailLogin: email 登入頁面
export default function EmailLogin() {
  const [state, setState] = useState<'register' | 'login'>('login');

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {error, loading, register, login} = usePasswordLogin();

  const navigation = useNavigation();

  async function handleRegister() {
    if (!name || !email || !password) {
      return;
    }

    try {
      await register(name, email, password);
      await login(email, password);
      navigation.goBack();
    } catch {
      //
    }
  }

  async function handleLogin() {
    try {
      await login(email, password);
      navigation.goBack();
    } catch {
      //
    }
  }

  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <Text style={[Styles.title, styles.title]}>Email Login</Text>

      {state === 'register' && (
        <>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            defaultValue={name}
            onChangeText={setName}
          />
        </>
      )}

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        defaultValue={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        defaultValue={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {state === 'register' && (
        <View style={styles.row}>
          <Button
            title={loading ? 'Loading...' : 'Register'}
            disabled={loading}
            onPress={handleRegister}
          />
          <TouchableOpacity onPress={() => setState('login')}>
            <Text style={styles.label}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      )}

      {state === 'login' && (
        <View style={styles.row}>
          <Button
            title={loading ? 'Loading...' : 'Login'}
            disabled={loading}
            onPress={handleLogin}
          />
          <TouchableOpacity onPress={() => setState('register')}>
            <Text style={styles.label}>Don't have an account?</Text>
          </TouchableOpacity>
        </View>
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
  },
  error: {
    color: colors.contrast,
    marginTop: 16,
  },
});
