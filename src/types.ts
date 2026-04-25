export interface Memo {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export type SortOrder = 'newest' | 'oldest' | 'alpha';
