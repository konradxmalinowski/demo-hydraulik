import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DemoModeService {
  readonly modalOpen = signal(false);

  open(): void {
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }
}
