import {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {useTranslation} from 'react-i18next';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [name, setName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const {setItem: setToken, removeItem: removeToken} =
    useAsyncStorage('@user.token');
  const {setItem: setSession, removeItem: removeSession} =
    useAsyncStorage('@user.session');

  const {t} = useTranslation();

  async function logout() {
    await removeToken();
    await removeSession();
    await auth().signOut();
  }

  function getUsername(): string {
    if (user) {
      const providerData = user.providerData[0];
      switch (providerData.providerId) {
        case 'phone':
          return providerData.phoneNumber;
        case 'password':
        case 'google.com':
        case 'facebook.com':
          return providerData.displayName || providerData.email;
      }
    }

    return t('profile.not-loggedin');
  }

  function getProfilePic(): string | null {
    if (user) {
      const providerData = user.providerData[0];
      switch (providerData.providerId) {
        case 'google.com':
        case 'facebook.com':
          return providerData.photoURL;
      }
    }

    return null;
  }

  async function loginApi(token: string) {
    const url =
      'https://msc-guide-server-next-rho.vercel.app/api/auth/mobile-login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token}),
    });
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    setName(getUsername());
    setProfilePic(getProfilePic());
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async _user => {
      if (_user) {
        const token = await _user.getIdToken();
        const session = await loginApi(token);
        setToken(token);
        setSession(
          JSON.stringify({
            session: session.session,
            sessionSig: session.sessionSig,
          }),
        );
        setUser(_user);
        setProvider(_user?.providerData[0]);
      } else {
        setUser(null);
        setProvider(null);
      }
    });

    return subscriber;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    user,
    provider,
    name,
    profilePic,
    logout,
  };
}
