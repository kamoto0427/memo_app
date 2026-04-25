import { Memo } from './types';
import { loadMemos, saveMemos } from './storage';

export class MemoStore {
  private memos: Memo[] = loadMemos();

  getAll(): Memo[] {
    return [...this.memos];
  }

  add(title: string, body: string): Memo {
    const now = new Date().toISOString();
    const memo: Memo = {
      id: Date.now(),
      title: title.trim() || '無題のメモ',
      body: body.trim(),
      createdAt: now,
      updatedAt: now,
    };
    this.memos.unshift(memo);
    this.persist();
    return memo;
  }

  update(id: number, title: string, body: string): void {
    const memo = this.memos.find((m) => m.id === id);
    if (!memo) return;
    memo.title = title.trim() || '無題のメモ';
    memo.body = body.trim();
    memo.updatedAt = new Date().toISOString();
    this.persist();
  }

  remove(id: number): void {
    this.memos = this.memos.filter((m) => m.id !== id);
    this.persist();
  }

  private persist(): void {
    saveMemos(this.memos);
  }
}
