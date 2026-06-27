import { Platform } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import { FontMap } from '@/constants/Typography';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { AlerteBanner } from '@/components/alerte-banner';
import { AdminShell } from '@/components/admin/admin-shell';
import { AuthRedirect } from '@/components/auth-redirect';
import { AuthLoading } from '@/components/auth-loading';
import { useAlertesRealtime } from '@/hooks/use-alertes-realtime';

SplashScreen.preventAutoHideAsync();

function AlertesRealtimeProvider({ children }: { children: React.ReactNode }) {
  useAlertesRealtime();
  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts(FontMap);
  const setSession = useAppStore((s) => s.setSession);
  const setProfile = useAppStore((s) => s.setProfile);
  const setAuthInitialized = useAppStore((s) => s.setAuthInitialized);
  const session = useAppStore((s) => s.session);
  const authInitialized = useAppStore((s) => s.authInitialized);
  const segments = useSegments();
  const onLoginRoute = (segments as string[]).includes('login');

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (data) {
          setProfile(data);
        }
      } catch {
        // Profile might not exist yet — non-critical
      }
    };

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setSession({ user: { id: session.user.id, email: session.user.email ?? '' } });
          loadProfile(session.user.id);
        }
      })
      .catch(() => {
        // Auth session fetch failed (timeout or network) — non-critical at startup
      })
      .finally(() => {
        setAuthInitialized(true);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession({ user: { id: session.user.id, email: session.user.email ?? '' } });
        loadProfile(session.user.id);
      } else {
        setSession(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setProfile, setAuthInitialized]);

  if (!loaded && !error) {
    return null;
  }

  if (!authInitialized) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthLoading />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  const navigation = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="gov-dashboard"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="risk-check"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );

  const showAdminShell = Platform.OS === 'web' && session && !onLoginRoute;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AlertesRealtimeProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <AuthRedirect />
            {showAdminShell ? <AdminShell>{navigation}</AdminShell> : navigation}
            {session ? <AlerteBanner /> : null}
          </View>
        </AlertesRealtimeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
