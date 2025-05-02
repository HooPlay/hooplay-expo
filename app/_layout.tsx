import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [loaded] = useFonts({
    'Pretendard-Black': require('~/assets/fonts/Pretendard-Black.ttf'),
    'Pretendard-Bold': require('~/assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-ExtraBold': require('~/assets/fonts/Pretendard-ExtraBold.ttf'),
    'Pretendard-ExtraLight': require('~/assets/fonts/Pretendard-ExtraLight.ttf'),
    'Pretendard-Light': require('~/assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-Medium': require('~/assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-Regular': require('~/assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-SemiBold': require('~/assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Thin': require('~/assets/fonts/Pretendard-Thin.ttf'),
  });

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded || !loaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Starter Base',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect;
