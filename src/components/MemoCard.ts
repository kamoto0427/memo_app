import { Memo } from '../types';
import { escHtml, formatDate } from '../utils';
import { TagInput } from './TagInput';

interface MemoCardCallbacks {
  onEdit: (id: number, title: string, body: string, tags: string[]) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'draft' | 'published') => void;
}

export function renderMemoCard(memo: Memo, callbacks: MemoCardCallbacks): HTMLElement {
  const card = document.createElement('div');
  card.className = 'memo-card';
  card.id = `card-${memo.id}`;
  card.innerHTML = buildCardHTML(memo);

  card.querySelector<HTMLButtonElement>('.btn-edit')!
    .addEventListener('click', () => startEdit(card, memo, callbacks));

  card.querySelector<HTMLButtonElement>('.btn-delete')!
    .addEventListener('click', () => callbacks.onDelete(memo.id));

  card.querySelector<HTMLButtonElement>('.btn-status')!
    .addEventListener('click', () => {
      const next = memo.status === 'draft' ? 'published' : 'draft';
      callbacks.onStatusChange(memo.id, next);
    });

  return card;
}

function buildCardHTML(memo: Memo): string {
  const updated = memo.updatedAt !== memo.createdAt
    ? `<span>更新: ${formatDate(memo.updatedAt)}</span>`
    : '';

  const isDraft = memo.status === 'draft';
  const statusBadge = isDraft
    ? `<span class="status-badge status-draft">下書き</span>`
    : `<span class="status-badge status-published">公開</span>`;
  const statusBtnLabel = isDraft ? '公開する' : '下書きに戻す';

  return `
    <div class="memo-card-header">
      <div class="memo-card-title">${escHtml(memo.title)}</div>
      <div class="memo-card-actions">
        ${statusBadge}
        <button class="btn btn-ghost btn-status btn-status-toggle" title="${statusBtnLabel}">${statusBtnLabel}</button>
        <button class="btn-icon btn-edit" title="編集">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon btn-delete" title="削除">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
    ${memo.body ? `<div class="memo-card-body">${escHtml(memo.body)}</div>` : ''}
    ${memo.tags.length > 0 ? `<div class="memo-card-tags">${memo.tags.map((t) => `<span class="tag-chip-readonly">${escHtml(t)}</span>`).join('')}</div>` : ''}
    <div class="memo-card-footer">
      <span>作成: ${formatDate(memo.createdAt)}</span>
      ${updated}
    </div>
  `;
}

function startEdit(card: HTMLElement, memo: Memo, callbacks: MemoCardCallbacks): void {
  card.classList.add('editing');
  card.innerHTML = `
    <input class="edit-input-title" id="edit-title-${memo.id}" value="${escHtml(memo.title)}" placeholder="タイトル" />
    <textarea class="edit-textarea-body" id="edit-body-${memo.id}">${escHtml(memo.body)}</textarea>
    <div id="edit-tags-mount-${memo.id}" class="edit-tags-row"></div>
    <div class="edit-actions">
      <button class="btn btn-ghost" id="cancel-edit-${memo.id}">キャンセル</button>
      <button class="btn btn-primary" id="save-edit-${memo.id}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        保存
      </button>
    </div>
  `;

  const titleInput = card.querySelector<HTMLInputElement>(`#edit-title-${memo.id}`)!;
  const bodyInput = card.querySelector<HTMLTextAreaElement>(`#edit-body-${memo.id}`)!;
  const tagInput = new TagInput(
    card.querySelector<HTMLElement>(`#edit-tags-mount-${memo.id}`)!,
    memo.tags
  );

  titleInput.focus();

  card.querySelector(`#cancel-edit-${memo.id}`)!.addEventListener('click', () => {
    card.classList.remove('editing');
    card.innerHTML = buildCardHTML(memo);
    card.querySelector<HTMLButtonElement>('.btn-edit')!
      .addEventListener('click', () => startEdit(card, memo, callbacks));
    card.querySelector<HTMLButtonElement>('.btn-delete')!
      .addEventListener('click', () => callbacks.onDelete(memo.id));
    card.querySelector<HTMLButtonElement>('.btn-status')!
      .addEventListener('click', () => {
        const next = memo.status === 'draft' ? 'published' : 'draft';
        callbacks.onStatusChange(memo.id, next);
      });
  });

  card.querySelector(`#save-edit-${memo.id}`)!.addEventListener('click', () => {
    const newTitle = titleInput.value.trim();
    const newBody = bodyInput.value.trim();
    if (!newTitle && !newBody) return;
    callbacks.onEdit(memo.id, newTitle, newBody, tagInput.getTags());
  });

  bodyInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      const newTitle = titleInput.value.trim();
      const newBody = bodyInput.value.trim();
      if (!newTitle && !newBody) return;
      callbacks.onEdit(memo.id, newTitle, newBody, tagInput.getTags());
    }
  });
}
