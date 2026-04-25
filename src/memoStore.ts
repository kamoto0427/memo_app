import { Memo } from './types';
import { loadMemos, saveMemos } from './storage';

export class MemoStore {
  private memos: Memo[] = loadMemos();

  getAll(): Memo[] {
    return [...this.memos];
  }

  add(title: string, body: string, status: 'draft' | 'published'): Memo {
    const now = new Date().toISOString();
    this.memos.forEach((m) => { m.order += 1; });
    const memo: Memo = {
      id: Date.now(),
      title: title.trim() || '無題のメモ',
      body: body.trim(),
      status,
      order: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.memos.unshift(memo);
    this.persist();
    return memo;
  }

  reorder(orderedIds: number[]): void {
    orderedIds.forEach((id, index) => {
      const memo = this.memos.find((m) => m.id === id);
      if (memo) memo.order = index;
    });
    this.persist();
  }

  update(id: number, title: string, body: string): void {
    const memo = this.memos.find((m) => m.id === id);
    if (!memo) return;
    memo.title = title.trim() || '無題のメモ';
    memo.body = body.trim();
    memo.updatedAt = new Date().toISOString();
    this.persist();
  }

  updateStatus(id: number, status: 'draft' | 'published'): void {
    const memo = this.memos.find((m) => m.id === id);
    if (!memo) return;
    memo.status = status;
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
