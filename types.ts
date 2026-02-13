
export interface GenerationResult {
  sql: string;
  explanation?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
