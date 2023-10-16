export interface Word {
  id: number;
  meaning: string;
  category: string;
  correct: boolean | null;
  customBookId: number | null;
}
