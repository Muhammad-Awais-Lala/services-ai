import { useAuth } from '../../src/context/AuthContext';
import { redirect } from 'expo-router';
import { useEffect } from 'react';

export default function AuthRoot() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      redirect('/(app)/chat');
    } else {
      redirect('/(auth)/login');
    }
  }, [user]);

  return null;
}
