import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function RootScreen() {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (role === 'provider') {
        router.replace('/(app)/dashboard');
      } else {
        router.replace('/(app)/chat');
      }
    } else {
      router.replace('/(auth)/login');
    }
  }, [user, role]);

  return null;
}
