import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Banner, Button, GREEN, Screen } from '@/components/ui';
import { DISEASES, type Lang } from '@/data/diseases';
import { getDiagnosis, logEvent, type DiagnosisRow } from '@/db/repo';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/lib/settings';
import type { ClassId } from '@/ml';

const ICONS: Record<string, string> = {
  uproot: '🌱', 'clean-cuttings': '✂️', 'resistant-variety': '🛡️', spray: '🧴',
  safety: '⚠️', report: '📣', monitor: '👀', ok: '✅',
};

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { language, deviceCode, t } = useSettings();
  const lang: Lang = language ?? 'en';
  const [row, setRow] = useState<DiagnosisRow | null>(null);

  useEffect(() => {
    getDiagnosis(Number(id)).then(setRow);
  }, [id]);

  const disease = row ? DISEASES[row.class_id as ClassId] : null;
  const audio = disease?.audio[lang] ?? null;
  const player = useAudioPlayer(audio);

  useEffect(() => {
    if (row?.accepted) logEvent(deviceCode, 'view_advice', row.class_id);
  }, [row, deviceCode]);

  if (!row || !disease) return <Screen />;
  const accepted = row.accepted === 1;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {row.model_version === 'stub' && <Banner text={t('demoBanner')} />}
        <Image source={{ uri: row.photo_path }} style={{ height: 220, borderRadius: 16 }} contentFit="cover" />

        {accepted ? (
          <>
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800' }}>{disease.name[lang]}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
              {t('confidence')}: {Math.round(row.confidence * 100)}%
            </Text>
            {disease.status === 'draft' && <Banner text={t('draftBanner')} />}
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: '700' }}>{t('advice')}</Text>
            {disease.advice.map((a, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 30 }}>{ICONS[a.icon]}</Text>
                <Text style={{ color: theme.text, fontSize: 18, flex: 1 }}>{a.text[lang]}</Text>
              </View>
            ))}
            <Button
              kind="secondary"
              label={audio ? t('playAudio') : t('noAudio')}
              disabled={!audio}
              onPress={() => {
                logEvent(deviceCode, 'play_audio', row.class_id);
                player.seekTo(0);
                player.play();
              }}
            />
          </>
        ) : (
          <>
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800' }}>{t('notRecognised')}</Text>
            <Text style={{ color: theme.text, fontSize: 18 }}>{t('notRecognisedBody')}</Text>
            <Text style={{ color: GREEN, fontSize: 16, fontWeight: '700' }}>{t('referralQueued')}</Text>
          </>
        )}

        <Button label={t('scanAgain')} onPress={() => router.replace('/scan')} />
      </ScrollView>
    </Screen>
  );
}
