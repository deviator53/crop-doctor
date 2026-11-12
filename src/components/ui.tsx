import { Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

export const GREEN = '#1F7A3E';
export const AMBER = '#B7791F';

export function Screen({ children, style }: ViewProps) {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={[styles.body, style]}>{children}</View>
    </SafeAreaView>
  );
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  const theme = useTheme();
  const primary = kind === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: primary ? GREEN : theme.backgroundElement, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
      ]}>
      <Text style={[styles.buttonText, { color: primary ? '#fff' : theme.text }]}>{label}</Text>
    </Pressable>
  );
}

export function Banner({ text, tone = 'warn' }: { text: string; tone?: 'warn' | 'info' }) {
  return (
    <View style={[styles.banner, { backgroundColor: tone === 'warn' ? '#FEF3C7' : '#E0F2FE' }]}>
      <Text style={[styles.bannerText, { color: tone === 'warn' ? '#7C4A03' : '#075985' }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: { flex: 1, padding: 20, gap: 14 },
  button: { minHeight: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  buttonText: { fontSize: 18, fontWeight: '700' },
  banner: { borderRadius: 10, padding: 10 },
  bannerText: { fontSize: 14, fontWeight: '600' },
});
