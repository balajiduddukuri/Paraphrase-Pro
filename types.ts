export interface ParaphraseOption {
  tone: string;
  message: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}