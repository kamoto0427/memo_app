export interface Memo {
  id: number;
  title: string;
  body: string;
  status: 'draft' | 'published';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type SortOrder = 'newest' | 'oldest' | 'alpha' | 'manual';
export type StatusFilter = 'all' | 'draft' | 'published';
