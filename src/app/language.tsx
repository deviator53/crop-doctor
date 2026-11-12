import { useRouter } from 'expo-router';
import { Text } from 'react-native';

import { Button, Screen } from '@/components/ui';
import { LANGS } from '@/data/diseases';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/lib/settings';

export default function LanguageScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { setLanguage, t } = useSettings();

  return (
    <Screen style={{ justifyContent: 'center' }}>
      <Text style={{ color: theme.text, fontSize: 24, fontWeight: '700', textAlign: 'center' }}>
        {t('chooseLanguage')}
      </Text>
      {LANGS.map((l) => (
        <Button
          key={l.code}
          label={l.label}
          onPress={async () => {
            await setLanguage(l.code);
            router.replace('/');
          }}
        />
      ))}
    </Screen>
  );
}
