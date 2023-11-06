import {useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

interface ReturnType {
  state: StateEnum;
  error: string | null;
  login: (phone: string) => void;
  verify: (code: string) => void;
}

type StateEnum =
  | 'idle'
  | 'loading-code'
  | 'pending'
  | 'loading-verify'
  | 'success'
  | 'error';

type ConfirmationResult = FirebaseAuthTypes.ConfirmationResult | null;

export default function useSmsLogin(): ReturnType {
  const [state, setState] = useState<StateEnum>('idle');
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationResult>(null);

  async function login(phone: string) {
    try {
      setState('loading-code');
      const res = await auth().signInWithPhoneNumber(phone);
      setConfirmation(res);
      setState('pending');
    } catch (e: any) {
      setState('idle');
      switch (e.code) {
        case 'auth/invalid-phone-number':
          setError('Invalid phone number.');
          break;
        case 'auth/missing-phone-number':
          setError('Missing phone number.');
          break;
        default:
          setError(`Something went wrong. (${e.code})`);
      }
    }
  }

  async function verify(code: string) {
    try {
      setState('loading-verify');
      await confirmation?.confirm(code);
      setState('success');
    } catch (e: any) {
      setState('pending');
      setError(e.message);
    }
  }

  return {
    state,
    error,
    login,
    verify,
  };
}
