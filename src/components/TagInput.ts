import { MAX_TAGS, MAX_TAG_LENGTH } from '../types';
import { escHtml } from '../utils';

export class TagInput {
  private input: HTMLInputElement;
  private chipList: HTMLElement;
  private hint: HTMLElement;
  private tags: string[] = [];

  constructor(private mountEl: HTMLElement, initialTags: string[] = []) {
    this.tags = [...initialTags];
    this.mountEl.innerHTML = `
      <div class="tag-input-wrap">
        <div class="tag-chip-list"></div>
        <input class="tag-text-input" type="text" placeholder="タグを追加…" maxlength="${MAX_TAG_LENGTH}" />
      </div>
      <span class="tag-hint"></span>
    `;
    this.chipList = this.mountEl.querySelector('.tag-chip-list')!;
    this.input = this.mountEl.querySelector('.tag-text-input')!;
    this.hint = this.mountEl.querySelector('.tag-hint')!;
    this.renderChips();
    this.updateHint();
    this.bindEvents();
  }

  getTags(): string[] {
    return [...this.tags];
  }

  reset(): void {
    this.tags = [];
    this.input.value = '';
    this.renderChips();
    this.updateHint();
  }

  private addTag(raw: string): void {
    const tag = raw.trim().toLowerCase();
    if (!tag || tag.length > MAX_TAG_LENGTH) return;
    if (this.tags.includes(tag)) return;
    if (this.tags.length >= MAX_TAGS) return;
    this.tags.push(tag);
    this.renderChips();
    this.updateHint();
  }

  private removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
    this.renderChips();
    this.updateHint();
  }

  private renderChips(): void {
    this.chipList.innerHTML = this.tags
      .map(
        (t) =>
          `<span class="tag-chip">
            ${escHtml(t)}
            <button class="tag-chip-remove" data-tag="${escHtml(t)}" type="button" aria-label="${escHtml(t)}を削除">×</button>
          </span>`
      )
      .join('');

    this.chipList.querySelectorAll<HTMLButtonElement>('.tag-chip-remove').forEach((btn) => {
      btn.addEventListener('click', () => this.removeTag(btn.dataset.tag!));
    });
  }

  private updateHint(): void {
    const remaining = MAX_TAGS - this.tags.length;
    if (remaining <= 0) {
      this.input.disabled = true;
      this.hint.textContent = `タグは最大${MAX_TAGS}個まで追加できます`;
      this.hint.classList.add('tag-hint-warn');
    } else {
      this.input.disabled = false;
      this.hint.textContent = `Enter またはカンマで追加（あと${remaining}個）`;
      this.hint.classList.remove('tag-hint-warn');
    }
  }

  private bindEvents(): void {
    this.input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        e.stopPropagation();
        this.addTag(this.input.value);
        this.input.value = '';
      }
      if (e.key === 'Backspace' && this.input.value === '' && this.tags.length > 0) {
        this.removeTag(this.tags[this.tags.length - 1]);
      }
    });

    this.input.addEventListener('paste', (e: ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData?.getData('text') ?? '';
      pasted.split(',').forEach((segment) => {
        if (segment.trim()) this.addTag(segment);
      });
      this.input.value = '';
    });
  }
}
