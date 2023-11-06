import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';

interface ReturnType {
  login: () => Promise<FirebaseAuthTypes.UserCredential>;
}

export default function useFacebookLogin(): ReturnType {
  async function login() {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw new Error('User cancelled the login process');
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw new Error('Something went wrong obtaining access token');
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    return auth().signInWithCredential(facebookCredential);
  }

  return {
    login,
  };
}
