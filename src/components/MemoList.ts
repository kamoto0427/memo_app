import { Memo, SortOrder, StatusFilter } from '../types';
import { renderMemoCard } from './MemoCard';

interface MemoListCallbacks {
  onEdit: (id: number, title: string, body: string, tags: string[]) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'draft' | 'published') => void;
}

export class MemoList {
  private listEl: HTMLElement;
  private visibleCountEl: HTMLElement;

  constructor(private callbacks: MemoListCallbacks) {
    this.listEl = document.getElementById('memo-list')!;
    this.visibleCountEl = document.getElementById('visible-count')!;
  }

  render(memos: Memo[], query: string, sort: SortOrder, statusFilter: StatusFilter): void {
    const filtered = this.filterByStatus(this.filter(memos, query), statusFilter);
    const sorted = this.sort(filtered, sort);

    this.visibleCountEl.textContent = String(sorted.length);

    if (sorted.length === 0) {
      this.listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <p>${
            memos.length === 0
              ? 'まだメモがありません。最初のメモを追加してみましょう！'
              : '該当するメモが見つかりません。'
          }</p>
        </div>`;
      return;
    }

    this.listEl.innerHTML = '';
    sorted.forEach((memo) => {
      this.listEl.appendChild(renderMemoCard(memo, this.callbacks));
    });
  }

  private filter(memos: Memo[], query: string): Memo[] {
    if (!query) return memos;
    const q = query.toLowerCase();
    return memos.filter(
      (m) => m.title.toLowerCase().includes(q) || m.body.toLowerCase().includes(q)
    );
  }

  private filterByStatus(memos: Memo[], statusFilter: StatusFilter): Memo[] {
    if (statusFilter === 'all') return memos;
    return memos.filter((m) => m.status === statusFilter);
  }

  private sort(memos: Memo[], order: SortOrder): Memo[] {
    return [...memos].sort((a, b) => {
      if (order === 'newest') return b.createdAt.localeCompare(a.createdAt);
      if (order === 'oldest') return a.createdAt.localeCompare(b.createdAt);
      return a.title.localeCompare(b.title, 'ja');
    });
  }
}
