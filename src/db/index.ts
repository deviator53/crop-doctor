import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';

const KEY_NAME = 'db-key-v1';
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getOrCreateKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(KEY_NAME);
  if (existing) return existing;
  const bytes = Crypto.getRandomBytes(32);
  const key = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  await SecureStore.setItemAsync(KEY_NAME, key);
  return key;
}

/** Encrypted (SQLCipher) database; the key lives in the Android Keystore via SecureStore (NFR4). */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  dbPromise ??= (async () => {
    const db = await SQLite.openDatabaseAsync('cropdoctor.db');
    const key = await getOrCreateKey();
    await db.execAsync(`PRAGMA key = "x'${key}'";`);
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await migrate(db);
    return db;
  })();
  return dbPromise;
}

const MIGRATIONS = [
  // v1
  `
  CREATE TABLE diagnoses (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at    TEXT NOT NULL,            -- ISO 8601
    device_code   TEXT NOT NULL,            -- shared-phone analysis (FR4)
    cooperative   TEXT,
    lga           TEXT,                     -- coarse location only (NFR4)
    language      TEXT NOT NULL,
    class_id      TEXT NOT NULL,
    confidence    REAL NOT NULL,
    accepted      INTEGER NOT NULL,         -- 0 => "not recognised", referral queued
    top3_json     TEXT NOT NULL,
    model_version TEXT NOT NULL,
    latency_ms    INTEGER NOT NULL,
    photo_path    TEXT NOT NULL,
    referral      INTEGER NOT NULL DEFAULT 0,
    synced        INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX idx_diagnoses_synced ON diagnoses (synced, referral);

  CREATE TABLE events (                     -- every use event, for adoption analysis (H5)
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT NOT NULL,
    device_code TEXT NOT NULL,
    type        TEXT NOT NULL,              -- app_open | scan | view_advice | play_audio | change_language
    detail      TEXT,
    synced      INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `,
];

async function migrate(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < MIGRATIONS.length) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[version]);
      await db.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
    version++;
  }
}
