import './style.css';
import { MemoStore } from './memoStore';
import { MemoForm } from './components/MemoForm';
import { MemoList } from './components/MemoList';
import { ConfirmDialog } from './components/ConfirmDialog';
import { SortOrder } from './types';
import { showToast } from './utils';

const store = new MemoStore();

const headerCount = document.getElementById('memo-count-header')!;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;

function refresh(): void {
  const memos = store.getAll();
  headerCount.textContent = `${memos.length} 件`;
  memoList.render(memos, searchInput.value, sortSelect.value as SortOrder);
}

const confirmDialog = new ConfirmDialog((id) => {
  store.remove(id);
  refresh();
  showToast('メモを削除しました');
});

const memoList = new MemoList({
  onEdit: (id, title, body) => {
    store.update(id, title, body);
    refresh();
    showToast('メモを更新しました');
  },
  onDelete: (id) => confirmDialog.open(id),
});

new MemoForm((title, body) => {
  store.add(title, body);
  refresh();
  showToast('メモを追加しました');
});

searchInput.addEventListener('input', refresh);
sortSelect.addEventListener('change', refresh);

refresh();
