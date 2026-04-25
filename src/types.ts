export interface Memo {
  id: number;
  title: string;
  body: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export type SortOrder = 'newest' | 'oldest' | 'alpha';
export type StatusFilter = 'all' | 'draft' | 'published';
