import { Memo } from './types';

const KEY = 'memos';

export function loadMemos(): Memo[] {
  try {
    const memos = JSON.parse(localStorage.getItem(KEY) ?? '[]') as Memo[];
    return memos.map((m) => ({
      ...m,
      status: m.status ?? 'published',
      tags: Array.isArray(m.tags) ? m.tags : [],
    }));
  } catch {
    return [];
  }
}

export function saveMemos(memos: Memo[]): void {
  localStorage.setItem(KEY, JSON.stringify(memos));
}
