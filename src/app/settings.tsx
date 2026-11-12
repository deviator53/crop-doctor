import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button, GREEN, Screen } from '@/components/ui';
import { LANGS, LGAS } from '@/data/diseases';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/lib/settings';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { language, setLanguage, deviceCode, cooperative, lga, setField, t } = useSettings();

  const input = {
    borderWidth: 1,
    borderColor: theme.backgroundSelected,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: theme.text,
  } as const;
  const label = { color: theme.textSecondary, fontWeight: '600', marginTop: 8 } as const;

  return (
    <Screen>
      <Text style={label}>{t('language')}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {LANGS.map((l) => (
          <Pressable
            key={l.code}
            onPress={() => setLanguage(l.code)}
            style={{
              paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20,
              backgroundColor: language === l.code ? GREEN : theme.backgroundElement,
            }}>
            <Text style={{ color: language === l.code ? '#fff' : theme.text, fontWeight: '700' }}>{l.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={label}>{t('deviceCode')}</Text>
      <TextInput style={input} value={deviceCode} onChangeText={(v) => setField('deviceCode', v)} autoCapitalize="characters" />

      <Text style={label}>{t('cooperative')}</Text>
      <TextInput style={input} value={cooperative} onChangeText={(v) => setField('cooperative', v)} autoCapitalize="characters" />

      <Text style={label}>{t('lga')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {LGAS.map((l) => (
          <Pressable
            key={l}
            onPress={() => setField('lga', l)}
            style={{
              paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20,
              backgroundColor: lga === l ? GREEN : theme.backgroundElement,
            }}>
            <Text style={{ color: lga === l ? '#fff' : theme.text, fontWeight: '700' }}>{l}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 16 }}>
        <Button kind="secondary" label={t('back')} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
