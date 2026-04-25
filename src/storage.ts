import { Memo } from './types';

const KEY = 'memos';

export function loadMemos(): Memo[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Memo[];
  } catch {
    return [];
  }
}

export function saveMemos(memos: Memo[]): void {
  localStorage.setItem(KEY, JSON.stringify(memos));
}
