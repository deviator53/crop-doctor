import { Redirect, useRouter } from 'expo-router';
import { Text } from 'react-native';

import { Button, Screen } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/lib/settings';

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const { language, t } = useSettings();

  if (!language) return <Redirect href="/language" />;

  return (
    <Screen style={{ justifyContent: 'center' }}>
      <Text style={{ color: theme.text, fontSize: 34, fontWeight: '800', textAlign: 'center', marginBottom: 24 }}>
        {t('appName')}
      </Text>
      <Button label={t('scanLeaf')} onPress={() => router.push('/scan')} />
      <Button kind="secondary" label={t('history')} onPress={() => router.push('/history')} />
      <Button kind="secondary" label={t('settings')} onPress={() => router.push('/settings')} />
    </Screen>
  );
}
