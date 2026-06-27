import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { APP_NAME } from '@/constants/Brand';

const LOGO_SOURCE = require('@/assets/images/long_logo.png');

interface AppLogoProps {
  variant?: 'auth' | 'sidebar';
  style?: StyleProp<ViewStyle>;
}

const SIZES = {
  auth: { width: 280, height: 88 },
  sidebar: { width: 200, height: 64 },
} as const;

export function AppLogo({ variant = 'auth', style }: AppLogoProps) {
  const size = SIZES[variant];

  return (
    <View
      style={[
        styles.wrap,
        variant === 'sidebar' && styles.wrapSidebar,
        style,
      ]}
    >
      <Image
        source={LOGO_SOURCE}
        style={size}
        contentFit="contain"
        accessibilityLabel={APP_NAME}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapSidebar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
});
