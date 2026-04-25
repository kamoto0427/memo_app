import { Memo } from './types';

const KEY = 'memos';

export function loadMemos(): Memo[] {
  try {
    const memos = JSON.parse(localStorage.getItem(KEY) ?? '[]') as Memo[];
    return memos.map((m, i) => ({ ...m, status: m.status ?? 'published', order: m.order ?? i }));
  } catch {
    return [];
  }
}

export function saveMemos(memos: Memo[]): void {
  localStorage.setItem(KEY, JSON.stringify(memos));
}
