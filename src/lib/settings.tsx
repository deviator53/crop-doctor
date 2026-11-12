import * as Crypto from 'expo-crypto';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { Lang } from '@/data/diseases';
import { getSetting, logEvent, setSetting } from '@/db/repo';
import { STRINGS } from '@/i18n/strings';

interface SettingsState {
  ready: boolean;
  language: Lang | null; // null => first run, show language picker
  deviceCode: string;
  cooperative: string;
  lga: string;
  setLanguage: (l: Lang) => Promise<void>;
  setField: (key: 'deviceCode' | 'cooperative' | 'lga', value: string) => Promise<void>;
  t: (key: string) => string;
}

const Ctx = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [language, setLang] = useState<Lang | null>(null);
  const [deviceCode, setDeviceCode] = useState('');
  const [cooperative, setCooperative] = useState('');
  const [lga, setLga] = useState('');

  useEffect(() => {
    (async () => {
      let code = await getSetting('deviceCode');
      if (!code) {
        code = 'DEV-' + Crypto.getRandomBytes(2).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '').toUpperCase();
        await setSetting('deviceCode', code);
      }
      setDeviceCode(code);
      setLang(((await getSetting('language')) as Lang | null) ?? null);
      setCooperative((await getSetting('cooperative')) ?? '');
      setLga((await getSetting('lga')) ?? '');
      await logEvent(code, 'app_open');
      setReady(true);
    })();
  }, []);

  const setLanguage = useCallback(
    async (l: Lang) => {
      await setSetting('language', l);
      setLang(l);
      await logEvent(deviceCode, 'change_language', l);
    },
    [deviceCode],
  );

  const setField = useCallback(async (key: 'deviceCode' | 'cooperative' | 'lga', value: string) => {
    await setSetting(key, value);
    if (key === 'deviceCode') setDeviceCode(value);
    if (key === 'cooperative') setCooperative(value);
    if (key === 'lga') setLga(value);
  }, []);

  const t = useCallback((key: string) => STRINGS[language ?? 'en'][key] ?? key, [language]);

  const value = useMemo(
    () => ({ ready, language, deviceCode, cooperative, lga, setLanguage, setField, t }),
    [ready, language, deviceCode, cooperative, lga, setLanguage, setField, t],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSettings must be used inside SettingsProvider');
  return v;
}
