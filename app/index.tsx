import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { AuthLoading } from '@/components/auth-loading';

export default function Index() {
  const session = useAppStore((s) => s.session);
  const authInitialized = useAppStore((s) => s.authInitialized);

  if (!authInitialized) {
    return <AuthLoading />;
  }

  if (!session) {
    return <Redirect href={'/login' as never} />;
  }

  return <Redirect href="/(tabs)/map" />;
}
