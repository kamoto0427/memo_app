import './style.css';
import { MemoStore } from './memoStore';
import { MemoForm } from './components/MemoForm';
import { MemoList } from './components/MemoList';
import { ConfirmDialog } from './components/ConfirmDialog';
import { SortOrder, StatusFilter } from './types';
import { showToast } from './utils';

const store = new MemoStore();

const headerCount = document.getElementById('memo-count-header')!;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');

let statusFilter: StatusFilter = 'all';

function refresh(): void {
  const memos = store.getAll();
  headerCount.textContent = `${memos.length} 件`;
  memoList.render(memos, searchInput.value, sortSelect.value as SortOrder, statusFilter);
}

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    statusFilter = btn.dataset.filter as StatusFilter;
    refresh();
  });
});

const confirmDialog = new ConfirmDialog((id) => {
  store.remove(id);
  refresh();
  showToast('メモを削除しました');
});

const memoList = new MemoList({
  onEdit: (id, title, body, tags) => {
    store.update(id, title, body, tags);
    refresh();
    showToast('メモを更新しました');
  },
  onDelete: (id) => confirmDialog.open(id),
  onStatusChange: (id, status) => {
    store.updateStatus(id, status);
    refresh();
    showToast(status === 'published' ? 'メモを公開しました' : '下書きに戻しました');
  },
});

new MemoForm((title, body, status, tags) => {
  store.add(title, body, status, tags);
  refresh();
  showToast(status === 'published' ? 'メモを公開しました' : '下書きとして保存しました');
});

searchInput.addEventListener('input', refresh);
sortSelect.addEventListener('change', refresh);

refresh();
