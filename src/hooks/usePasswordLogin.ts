import {useState} from 'react';
import auth from '@react-native-firebase/auth';

interface ReturnType {
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => void;
  login: (email: string, password: string) => void;
  // clearError: () => void;
}

export default function usePasswordLogin(): ReturnType {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function register(name: string, email: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      await auth().createUserWithEmailAndPassword(email, password);
      await auth().currentUser?.updateProfile({displayName: name});
    } catch (e: any) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          setError('That email address is already in use!');
          throw new Error();
        case 'auth/invalid-email':
          setError('That email address is invalid!');
          throw new Error();
        case 'auth/operation-not-allowed':
          setError('That operation is not allowed!');
          throw new Error();
        default:
          setError('Something went wrong!');
          throw new Error();
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      switch (e.code) {
        case 'auth/invalid-email':
          setError('That email address is invalid!');
          throw new Error();
        case 'auth/user-disabled':
          setError('That user is disabled!');
          throw new Error();
        case 'auth/user-not-found':
          setError('That user was not found!');
          throw new Error();
        case 'auth/wrong-password':
          setError('That password is invalid!');
          throw new Error();
        default:
          setError('Something went wrong!');
          throw new Error();
      }
    } finally {
      setLoading(false);
    }
  }

  // function clearError() {
  //   setError(null);
  // }

  return {
    loading,
    error,
    register,
    login,
    // clearError,
  };
}
