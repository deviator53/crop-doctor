import type { ClassId } from '@/ml';

export type Lang = 'en' | 'ha' | 'yo';
export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ha', label: 'Hausa' },
  { code: 'yo', label: 'Yorùbá' },
];

export type Localised = Record<Lang, string>;

export interface AdviceItem {
  /** Icon key shown beside the text for low-literacy users (NFR3). */
  icon: 'uproot' | 'clean-cuttings' | 'resistant-variety' | 'spray' | 'safety' | 'report' | 'monitor' | 'ok';
  text: Localised;
}

export interface DiseaseInfo {
  id: ClassId;
  crop: 'cassava' | 'maize';
  healthy: boolean;
  name: Localised;
  /**
   * Content status. The proposal (§7.5) requires every item to be rated 3-4 by all three
   * crop-protection experts before use in the pilot. Until then it is a DRAFT and the UI
   * must say so.
   */
  status: 'draft' | 'validated';
  advice: AdviceItem[];
  /** Pre-recorded audio per language (bundled later; null until recorded). */
  audio: Record<Lang, number | null>;
}

const noAudio = { en: null, ha: null, yo: null } as const;

/**
 * DRAFT CONTENT - placeholders to exercise the UI. English only for now: Hausa and Yoruba
 * advice must be written by native-speaker agronomists and back-translated (§7.5), so those
 * fields fall back to English and the UI flags that. Do not show to farmers before the
 * expert panel has validated it.
 */
const en = (t: string): Localised => ({ en: t, ha: t, yo: t });

export const DISEASES: Record<ClassId, DiseaseInfo> = {
  cmd: {
    id: 'cmd',
    crop: 'cassava',
    healthy: false,
    status: 'draft',
    name: { en: 'Cassava mosaic disease', ha: 'Cutar mosaic ta rogo', yo: 'Àrùn mosaic ẹ̀gẹ́' },
    advice: [
      { icon: 'uproot', text: en('DRAFT: Remove and destroy infected plants.') },
      { icon: 'clean-cuttings', text: en('DRAFT: Plant only clean cuttings from healthy plants.') },
      { icon: 'resistant-variety', text: en('DRAFT: Use resistant varieties where available.') },
    ],
    audio: noAudio,
  },
  cbsd: {
    id: 'cbsd',
    crop: 'cassava',
    healthy: false,
    status: 'draft',
    name: { en: 'Cassava brown streak disease', ha: 'Cutar brown streak ta rogo', yo: 'Àrùn brown streak ẹ̀gẹ́' },
    advice: [
      { icon: 'report', text: en('DRAFT: Not yet reported in Nigeria. Report this to the extension office immediately.') },
      { icon: 'uproot', text: en('DRAFT: Do not move cuttings from this plant.') },
    ],
    audio: noAudio,
  },
  nlb: {
    id: 'nlb',
    crop: 'maize',
    healthy: false,
    status: 'draft',
    name: { en: 'Northern leaf blight', ha: 'Cutar leaf blight ta masara', yo: 'Àrùn leaf blight àgbàdo' },
    advice: [
      { icon: 'resistant-variety', text: en('DRAFT: Plant resistant varieties and rotate crops.') },
      { icon: 'spray', text: en('DRAFT: Fungicide guidance pending expert approval.') },
      { icon: 'safety', text: en('Always follow the safety instructions on any pesticide label.') },
    ],
    audio: noAudio,
  },
  southern_rust: {
    id: 'southern_rust',
    crop: 'maize',
    healthy: false,
    status: 'draft',
    name: { en: 'Southern rust', ha: 'Tsatsa ta masara', yo: 'Àrùn rust àgbàdo' },
    advice: [
      { icon: 'spray', text: en('DRAFT: Fungicide guidance pending expert approval.') },
      { icon: 'safety', text: en('Always follow the safety instructions on any pesticide label.') },
    ],
    audio: noAudio,
  },
  msv: {
    id: 'msv',
    crop: 'maize',
    healthy: false,
    status: 'draft',
    name: { en: 'Maize streak virus', ha: 'Cutar streak ta masara', yo: 'Àrùn streak àgbàdo' },
    advice: [
      { icon: 'uproot', text: en('DRAFT: Remove and destroy infected plants.') },
      { icon: 'resistant-variety', text: en('DRAFT: Plant streak-resistant varieties and sow early.') },
    ],
    audio: noAudio,
  },
  healthy_cassava: {
    id: 'healthy_cassava',
    crop: 'cassava',
    healthy: true,
    status: 'draft',
    name: { en: 'Healthy cassava', ha: 'Rogo lafiyayye', yo: 'Ẹ̀gẹ́ tó ní ìlera' },
    advice: [{ icon: 'monitor', text: en('This leaf looks healthy. Keep checking your plants regularly.') }],
    audio: noAudio,
  },
  healthy_maize: {
    id: 'healthy_maize',
    crop: 'maize',
    healthy: true,
    status: 'draft',
    name: { en: 'Healthy maize', ha: 'Masara lafiyayye', yo: 'Àgbàdo tó ní ìlera' },
    advice: [{ icon: 'monitor', text: en('This leaf looks healthy. Keep checking your plants regularly.') }],
    audio: noAudio,
  },
};

export const LGAS = ['Ido', 'Akinyele', 'Soba', 'Giwa'] as const;
