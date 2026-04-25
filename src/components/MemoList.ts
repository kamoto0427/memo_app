import { Memo, SortOrder, StatusFilter } from '../types';
import { renderMemoCard } from './MemoCard';

interface MemoListCallbacks {
  onEdit: (id: number, title: string, body: string) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'draft' | 'published') => void;
  onReorder: (orderedIds: number[]) => void;
}

export class MemoList {
  private listEl: HTMLElement;
  private visibleCountEl: HTMLElement;
  private dragSrcId: number | null = null;

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
      const card = renderMemoCard(memo, this.callbacks);
      this.setupDrag(card, memo.id);
      this.listEl.appendChild(card);
    });
  }

  private setupDrag(card: HTMLElement, id: number): void {
    card.draggable = true;

    card.addEventListener('dragstart', (e) => {
      this.dragSrcId = id;
      card.classList.add('card-dragging');
      e.dataTransfer!.effectAllowed = 'move';
      e.dataTransfer!.setData('text/plain', String(id));
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('card-dragging');
      this.listEl.querySelectorAll('.card-drag-over').forEach((el) =>
        el.classList.remove('card-drag-over')
      );
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move';
      if (this.dragSrcId !== id) {
        this.listEl.querySelectorAll('.card-drag-over').forEach((el) =>
          el.classList.remove('card-drag-over')
        );
        card.classList.add('card-drag-over');
      }
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('card-drag-over');
      if (this.dragSrcId === null || this.dragSrcId === id) return;

      const cards = Array.from(this.listEl.querySelectorAll<HTMLElement>('.memo-card'));
      const srcIndex = cards.findIndex((c) => c.dataset.memoId === String(this.dragSrcId));
      const dstIndex = cards.findIndex((c) => c.dataset.memoId === String(id));
      if (srcIndex === -1 || dstIndex === -1) return;

      // DOM上で並び替えてから順序を読み取る
      const srcCard = cards[srcIndex];
      if (srcIndex < dstIndex) {
        card.after(srcCard);
      } else {
        card.before(srcCard);
      }

      const orderedIds = Array.from(this.listEl.querySelectorAll<HTMLElement>('.memo-card'))
        .map((c) => Number(c.dataset.memoId));
      this.callbacks.onReorder(orderedIds);
      this.dragSrcId = null;
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
      if (order === 'manual') return a.order - b.order;
      return a.title.localeCompare(b.title, 'ja');
    });
  }
}
