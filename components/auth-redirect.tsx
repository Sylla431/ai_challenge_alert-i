import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export function AuthRedirect() {
  const router = useRouter();
  const segments = useSegments();
  const session = useAppStore((s) => s.session);
  const authInitialized = useAppStore((s) => s.authInitialized);

  useEffect(() => {
    if (!authInitialized) return;

    const onLogin = (segments as string[]).includes('login');

    if (!session && !onLogin) {
      router.replace('/login' as never);
      return;
    }

    if (session && onLogin) {
      router.replace('/(tabs)/map');
    }
  }, [authInitialized, session, segments, router]);

  return null;
}
