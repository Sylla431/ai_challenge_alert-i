import { Platform, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthScreen } from '@/components/auth-screen';
import { Colors } from '@/constants/Colors';

export default function LoginScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <AuthScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    ...Platform.select({
      web: { minHeight: '100vh' as unknown as number },
      default: {},
    }),
  },
});
