export enum AppView {
  EXTRACTOR = 'EXTRACTOR',
  REMIXER = 'REMIXER',
  HOLIDAYS = 'HOLIDAYS',
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  extractedPrompt?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // Description of date (e.g. "农历正月初一")
  significance: string;
  priestActivity: string; // What the priest does
  believerActivity: string; // What believers do
  visualElements: string; // Key visual keywords for AI generation
  defaultVestmentColor: string; // Liturgical color recommendation
}

export interface StylePreset {
  id: string;
  name: string;
  promptSuffix: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface GenerationConfig {
  batchSize: number;
  wordCount: number;
  shotType: string;
  environment: string;
  activity: string;
  vestmentColor: string;
}