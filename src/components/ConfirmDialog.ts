export class ConfirmDialog {
  private overlay: HTMLElement;
  private pendingId: number | null = null;

  constructor(private onConfirm: (id: number) => void) {
    this.overlay = document.getElementById('confirm-overlay')!;

    this.overlay.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.overlay) this.close();
    });

    document.getElementById('confirm-cancel')!.addEventListener('click', () => this.close());
    document.getElementById('confirm-ok')!.addEventListener('click', () => this.execute());

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open(id: number): void {
    this.pendingId = id;
    this.overlay.style.display = 'flex';
  }

  private close(): void {
    this.overlay.style.display = 'none';
    this.pendingId = null;
  }

  private execute(): void {
    if (this.pendingId === null) return;
    this.onConfirm(this.pendingId);
    this.close();
  }
}
