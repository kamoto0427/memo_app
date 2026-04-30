export interface Memo {
  id: number;
  title: string;
  body: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export type SortOrder = 'newest' | 'oldest' | 'alpha';
export type StatusFilter = 'all' | 'draft' | 'published';

export const MAX_TAGS = 5;
export const MAX_TAG_LENGTH = 20;
