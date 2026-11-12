import type { Prediction } from '@/ml';

import { getDb } from './index';

export interface DiagnosisRow {
  id: number;
  created_at: string;
  device_code: string;
  cooperative: string | null;
  lga: string | null;
  language: string;
  class_id: string;
  confidence: number;
  accepted: number;
  top3_json: string;
  model_version: string;
  latency_ms: number;
  photo_path: string;
  referral: number;
  synced: number;
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const r = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
  return r?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, value);
}

export async function logEvent(deviceCode: string, type: string, detail?: string) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO events (created_at, device_code, type, detail) VALUES (?, ?, ?, ?)',
    new Date().toISOString(),
    deviceCode,
    type,
    detail ?? null,
  );
}

export async function saveDiagnosis(args: {
  deviceCode: string;
  cooperative: string | null;
  lga: string | null;
  language: string;
  photoPath: string;
  prediction: Prediction;
}): Promise<number> {
  const db = await getDb();
  const p = args.prediction;
  const res = await db.runAsync(
    `INSERT INTO diagnoses
      (created_at, device_code, cooperative, lga, language, class_id, confidence, accepted,
       top3_json, model_version, latency_ms, photo_path, referral)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    new Date().toISOString(),
    args.deviceCode,
    args.cooperative,
    args.lga,
    args.language,
    p.classId,
    p.confidence,
    p.accepted ? 1 : 0,
    JSON.stringify(p.top3),
    p.modelVersion,
    p.latencyMs,
    args.photoPath,
    p.accepted ? 0 : 1, // low confidence => expert referral (FR5)
  );
  return res.lastInsertRowId;
}

export async function getDiagnosis(id: number): Promise<DiagnosisRow | null> {
  const db = await getDb();
  return db.getFirstAsync<DiagnosisRow>('SELECT * FROM diagnoses WHERE id = ?', id);
}

export async function listDiagnoses(): Promise<DiagnosisRow[]> {
  const db = await getDb();
  return db.getAllAsync<DiagnosisRow>('SELECT * FROM diagnoses ORDER BY id DESC LIMIT 200');
}
