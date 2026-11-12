import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { SettingsProvider, useSettings } from '@/lib/settings';

SplashScreen.preventAutoHideAsync();

function Shell() {
  const { ready, t } = useSettings();
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);
  if (!ready) return null;
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('appName') }} />
      <Stack.Screen name="language" options={{ title: t('language') }} />
      <Stack.Screen name="scan" options={{ title: t('scanLeaf') }} />
      <Stack.Screen name="result/[id]" options={{ title: t('appName') }} />
      <Stack.Screen name="history" options={{ title: t('history') }} />
      <Stack.Screen name="settings" options={{ title: t('settings') }} />
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SettingsProvider>
        <Shell />
      </SettingsProvider>
    </ThemeProvider>
  );
}
