import { Memo, MAX_TAGS, MAX_TAG_LENGTH } from './types';
import { loadMemos, saveMemos } from './storage';

export class MemoStore {
  private memos: Memo[] = loadMemos();

  getAll(): Memo[] {
    return [...this.memos];
  }

  add(title: string, body: string, status: 'draft' | 'published', tags: string[] = []): Memo {
    const now = new Date().toISOString();
    const memo: Memo = {
      id: Date.now(),
      title: title.trim() || '無題のメモ',
      body: body.trim(),
      tags: this.sanitizeTags(tags),
      status,
      createdAt: now,
      updatedAt: now,
    };
    this.memos.unshift(memo);
    this.persist();
    return memo;
  }

  update(id: number, title: string, body: string, tags: string[] = []): void {
    const memo = this.memos.find((m) => m.id === id);
    if (!memo) return;
    memo.title = title.trim() || '無題のメモ';
    memo.body = body.trim();
    memo.tags = this.sanitizeTags(tags);
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

  private sanitizeTags(tags: string[]): string[] {
    const seen = new Set<string>();
    return tags
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && t.length <= MAX_TAG_LENGTH)
      .filter((t) => { if (seen.has(t)) return false; seen.add(t); return true; })
      .slice(0, MAX_TAGS);
  }

  private persist(): void {
    saveMemos(this.memos);
  }
}
