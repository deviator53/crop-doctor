import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';

import { Screen } from '@/components/ui';
import { DISEASES, type Lang } from '@/data/diseases';
import { listDiagnoses, type DiagnosisRow } from '@/db/repo';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/lib/settings';
import type { ClassId } from '@/ml';

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { language, t } = useSettings();
  const lang: Lang = language ?? 'en';
  const [rows, setRows] = useState<DiagnosisRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      listDiagnoses().then(setRows);
    }, []),
  );

  return (
    <Screen>
      <FlatList
        data={rows}
        keyExtractor={(r) => String(r.id)}
        ListEmptyComponent={<Text style={{ color: theme.textSecondary, textAlign: 'center' }}>{t('noScans')}</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/result/[id]', params: { id: String(item.id) } })}
            style={{ paddingVertical: 14, borderBottomWidth: 1, borderColor: theme.backgroundSelected }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700' }}>
              {item.accepted ? DISEASES[item.class_id as ClassId].name[lang] : t('notRecognised')}
            </Text>
            <Text style={{ color: theme.textSecondary }}>
              {new Date(item.created_at).toLocaleString()} · {Math.round(item.confidence * 100)}%
            </Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}
