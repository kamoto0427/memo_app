import { TagInput } from './TagInput';

export class MemoForm {
  private titleEl: HTMLInputElement;
  private bodyEl: HTMLTextAreaElement;
  private draftBtn: HTMLButtonElement;
  private publishBtn: HTMLButtonElement;
  private tagInput: TagInput;

  constructor(private onSubmit: (title: string, body: string, status: 'draft' | 'published', tags: string[]) => void) {
    this.titleEl = document.getElementById('new-title') as HTMLInputElement;
    this.bodyEl = document.getElementById('new-body') as HTMLTextAreaElement;
    this.draftBtn = document.getElementById('draft-btn') as HTMLButtonElement;
    this.publishBtn = document.getElementById('publish-btn') as HTMLButtonElement;
    this.tagInput = new TagInput(document.getElementById('new-tags-mount') as HTMLElement);

    this.draftBtn.addEventListener('click', () => this.handleSubmit('draft'));
    this.publishBtn.addEventListener('click', () => this.handleSubmit('published'));
    this.titleEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') this.bodyEl.focus();
    });
    this.bodyEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) this.handleSubmit('draft');
    });
  }

  private handleSubmit(status: 'draft' | 'published'): void {
    const title = this.titleEl.value.trim();
    const body = this.bodyEl.value.trim();
    if (!title && !body) return;
    this.onSubmit(title, body, status, this.tagInput.getTags());
    this.titleEl.value = '';
    this.bodyEl.value = '';
    this.tagInput.reset();
    this.titleEl.focus();
  }
}
