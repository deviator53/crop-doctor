import { Camera, useCameraPermission, usePhotoOutput } from 'react-native-vision-camera';

import { Directory, File, Paths } from 'expo-file-system';
import { useIsFocused, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Banner, Button, Screen } from '@/components/ui';
import { DISEASES } from '@/data/diseases';
import { saveDiagnosis, logEvent } from '@/db/repo';
import { useSettings } from '@/lib/settings';
import { getClassifier } from '@/ml';

export default function ScanScreen() {
  const router = useRouter();
  const focused = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const photoOutput = usePhotoOutput();
  const { language, deviceCode, cooperative, lga, t } = useSettings();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);

  async function capture() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      const photo = await photoOutput.capturePhoto({}, {});
      try {
        const dir = new Directory(Paths.document, 'photos');
        if (!dir.exists) dir.create({ intermediates: true });
        const file = new File(dir, `${Date.now()}.jpg`);
        const [image] = await Promise.all([
          photo.toImageAsync(),
          photo.saveToFileAsync(file.uri.replace('file://', '')),
        ]);

        const classifier = await getClassifier();
        const prediction = await classifier.classify(image);
        image.dispose();

        const id = await saveDiagnosis({
          deviceCode,
          cooperative: cooperative || null,
          lga: lga || null,
          language: language ?? 'en',
          photoPath: file.uri,
          prediction,
        });
        await logEvent(deviceCode, 'scan', DISEASES[prediction.classId].id);
        router.replace({ pathname: '/result/[id]', params: { id: String(id) } });
      } finally {
        photo.dispose();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  if (!hasPermission) {
    return (
      <Screen style={{ justifyContent: 'center' }}>
        <Text style={styles.msg}>{t('cameraPermission')}</Text>
        <Button label={t('allow')} onPress={requestPermission} />
      </Screen>
    );
  }

  return (
    <View style={styles.fill}>
      <Camera style={StyleSheet.absoluteFill} device="back" isActive={focused && !busy} outputs={[photoOutput]} />
      <View style={styles.guideWrap} pointerEvents="none">
        <View style={styles.guide} />
      </View>
      <View style={styles.overlay}>
        <Banner tone="info" text={t('frameHint')} />
        {error ? <Banner text={error} /> : null}
        {busy ? (
          <View style={styles.busy}>
            <ActivityIndicator color="#fff" size="large" />
            <Text style={styles.busyText}>{t('analysing')}</Text>
          </View>
        ) : (
          <Button label={t('scanLeaf')} onPress={capture} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#000' },
  msg: { fontSize: 18, textAlign: 'center', color: '#888' },
  guideWrap: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  guide: {
    width: '80%',
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    borderStyle: 'dashed',
  },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 16, paddingBottom: 32 },
  busy: { alignItems: 'center', gap: 8 },
  busyText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
