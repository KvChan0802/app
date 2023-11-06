import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {RouteProp} from '@react-navigation/native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import Button from '../components/Button';
import {colors} from '../components/Styles';

import useNavigation from '../hooks/useNavigation';
import {RootStackParamList} from '../navigations/explore';

type Session = {
  session: string;
  sessionSig: string;
};

type CheckinScreenRouteProp = RouteProp<RootStackParamList, 'Checkin'>;

interface CheckinParams {
  route: CheckinScreenRouteProp;
}

// Tab: Explore
// Checkin: 簽到
export default function Checkin({route}: CheckinParams) {
  const {event} = route.params;
  const {t} = useTranslation();

  // form
  const [name, setName] = useState<string>('');
  const [areacode, setAreacode] = useState<string>('+853');
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string>('');

  // session
  const {getItem: getSession} = useAsyncStorage('@user.session');
  const [session, setSession] = useState<Session | null>(null);

  const {getItem: getCheckedin, setItem: setCheckedin} =
    useAsyncStorage('@checkin.records');

  // navigation
  const navigation = useNavigation();

  async function handleCheckin() {
    if (!session) {
      loginRequired();
      return;
    }

    if (!name || !areacode || !phone) {
      setError(t('explore.error.required'));
      return;
    }

    const domain = 'https://msc-guide-server-next-rho.vercel.app';
    const url = `${domain}/api/checkin`;
    const body = JSON.stringify({
      event: event.id,
      name,
      areacode,
      phone,
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        session: session.session,
        'session-sig': session.sessionSig,
      },
      body,
    });

    const json = await res.json();
    if (json.error) {
      setError(json.error);
      return;
    }

    if (json.status === 'ok') {
      const checkedinJSON = await getCheckedin();
      const checkedin = checkedinJSON ? JSON.parse(checkedinJSON) : [];
      checkedin.push(event.id);
      await setCheckedin(JSON.stringify(checkedin));

      Alert.alert(t('explore.checkin.title'), t('explore.checkin.success'));
      navigation.goBack();
    }
  }

  function loginRequired() {
    Alert.alert(t('explore.checkin.title'), t('explore.error.login'), [
      {
        text: t('cancel'),
        isPreferred: false,
      },
      {
        text: t('profile.login.title'),
        onPress: () => {
          navigation.goBack();
          navigation.navigate('User');
        },
        isPreferred: true,
      },
    ]);
  }

  useEffect(() => {
    async function exec() {
      const sessionJSON = await getSession();
      if (!sessionJSON) {
        loginRequired();
        return;
      }

      setSession(JSON.parse(sessionJSON));
    }

    exec();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>{event.name}</Text>

          <View>
            <Text style={styles.label}>{t('explore.checkin.name')}</Text>
            <TextInput
              style={styles.input}
              defaultValue={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text style={styles.label}>{t('explore.checkin.phone')}</Text>
            <View style={styles.phoneContainer}>
              <TextInput
                style={[styles.input, styles.area]}
                keyboardType="phone-pad"
                defaultValue={areacode}
                onChangeText={setAreacode}
              />
              <TextInput
                style={[styles.input, styles.phone]}
                keyboardType="phone-pad"
                defaultValue={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          <Button
            primary
            title={t('explore.checkin.checkin')}
            onPress={handleCheckin}
          />

          <Text style={styles.error}>{error}</Text>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#FFF',
    flex: 1,
    minHeight: '100%',
  },
  container: {
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderRadius: 4,
    marginBottom: 16,
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  area: {
    flexShrink: 2,
  },
  phone: {
    flexShrink: 1,
  },
  error: {
    color: colors.contrast,
    fontSize: 16,
    marginTop: 16,
  },
});
