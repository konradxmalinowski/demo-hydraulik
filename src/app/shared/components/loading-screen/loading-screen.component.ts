import {
  Component,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('logoEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms 100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
  styles: [`
    .loading-dot {
      animation: bounce 1.2s infinite;
    }
    .loading-dot:nth-child(2) { animation-delay: 0.2s; }
    .loading-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
      40% { transform: translateY(-10px); opacity: 1; }
    }
  `],
  template: `
    @if (visible()) {
      <div
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-900"
        role="status"
        aria-label="Wczytywanie strony"
        aria-live="polite"
        [@fadeOut]
      >
        <div [@logoEnter] class="flex flex-col items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            <span class="text-6xl" aria-hidden="true">🔧</span>
            <span class="text-3xl font-bold text-orange-500">HydroFix</span>
            <span class="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wider uppercase">24/7 Pogotowie Hydrauliczne</span>
          </div>

          <div class="flex gap-2 mt-4" aria-hidden="true">
            <span class="loading-dot w-3 h-3 rounded-full bg-orange-500"></span>
            <span class="loading-dot w-3 h-3 rounded-full bg-orange-500"></span>
            <span class="loading-dot w-3 h-3 rounded-full bg-orange-500"></span>
          </div>
        </div>
      </div>
    }
  `,
})
export class LoadingScreenComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly visible = signal(true);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.visible.set(false);
      }, 200);
    } else {
      this.visible.set(false);
    }
  }
}
