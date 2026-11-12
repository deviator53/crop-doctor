import type { Lang } from '@/data/diseases';

/**
 * UI strings. English is the source. Hausa and Yoruba are MACHINE-DRAFTED PLACEHOLDERS and
 * must be replaced by native-speaker agronomist translations, back-translated (proposal §7.5).
 */
type Dict = Record<string, string>;

const en: Dict = {
  appName: 'Crop Doctor',
  chooseLanguage: 'Choose your language',
  scanLeaf: 'Scan a leaf',
  history: 'Past scans',
  settings: 'Settings',
  demoBanner: 'DEMO MODEL - results are not real',
  draftBanner: 'Draft advice - not yet checked by experts',
  cameraPermission: 'Allow the camera to scan leaves',
  allow: 'Allow camera',
  frameHint: 'Fill the frame with one leaf. Use daylight. Hold steady.',
  analysing: 'Checking the leaf...',
  confidence: 'Confidence',
  notRecognised: 'Not recognised',
  notRecognisedBody: 'The app is not sure. The photo has been saved to send to an expert when you have a connection.',
  advice: 'What to do',
  playAudio: 'Listen',
  noAudio: 'Audio not available yet',
  scanAgain: 'Scan another leaf',
  noScans: 'No scans yet',
  deviceCode: 'Device code',
  cooperative: 'Cooperative code',
  lga: 'Local government area',
  language: 'Language',
  back: 'Back',
  referralQueued: 'Waiting to send to expert',
};

const ha: Dict = {
  ...en,
  chooseLanguage: 'Zabi harshe',
  scanLeaf: 'Duba ganye',
  history: 'Binciken da aka yi',
  settings: 'Saituna',
  language: 'Harshe',
  back: 'Koma baya',
};

const yo: Dict = {
  ...en,
  chooseLanguage: 'Yan èdè rẹ',
  scanLeaf: 'Ṣàyẹ̀wò ewé',
  history: 'Àwọn àyẹ̀wò tó ti kọjá',
  settings: 'Ètò',
  language: 'Èdè',
  back: 'Padà',
};

export const STRINGS: Record<Lang, Dict> = { en, ha, yo };
