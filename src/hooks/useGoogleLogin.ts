import {useEffect} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

interface ReturnTypes {
  login: () => Promise<UserCredential>;
}

type UserCredential = FirebaseAuthTypes.UserCredential;

export default function useGoogleLogin(): ReturnTypes {
  async function login(): Promise<UserCredential> {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    return auth().signInWithCredential(googleCredential);
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '78514613080-905ru0tln1u9qe0eafj2sp9be8oo5dm9.apps.googleusercontent.com',
    });
  }, []);

  return {
    login,
  };
}
