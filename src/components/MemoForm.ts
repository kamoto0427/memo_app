export class MemoForm {
  private titleEl: HTMLInputElement;
  private bodyEl: HTMLTextAreaElement;
  private submitBtn: HTMLButtonElement;

  constructor(private onSubmit: (title: string, body: string) => void) {
    this.titleEl = document.getElementById('new-title') as HTMLInputElement;
    this.bodyEl = document.getElementById('new-body') as HTMLTextAreaElement;
    this.submitBtn = document.getElementById('add-btn') as HTMLButtonElement;

    this.submitBtn.addEventListener('click', () => this.handleSubmit());
    this.titleEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') this.bodyEl.focus();
    });
    this.bodyEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) this.handleSubmit();
    });
  }

  private handleSubmit(): void {
    const title = this.titleEl.value.trim();
    const body = this.bodyEl.value.trim();
    if (!title && !body) return;
    this.onSubmit(title, body);
    this.titleEl.value = '';
    this.bodyEl.value = '';
    this.titleEl.focus();
  }
}
