import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { DemoModeService } from '../../../core/services/demo-mode.service';

const DEMO_TEXT =
  'To jest wersja demonstracyjna przygotowana w celu prezentacji możliwości wykonania strony internetowej dla klienta.';

@Component({
  selector: 'app-demo-modal',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
  template: `
    @if (demoModeService.modalOpen()) {
      <!--
        Backdrop click-to-close is a mouse-only convenience; the accessible
        equivalents (Escape key, visible "Zamknij" button) are handled at the
        component level, so the non-interactive backdrop/dialog wrapper divs
        are intentionally excluded from the keyboard-event and focusable-role
        template lint rules below.
      -->
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div
        class="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
        [@backdrop]
        (click)="demoModeService.close()"
      >
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events -->
        <div
          #dialogRef
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          tabindex="-1"
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col gap-4"
          [@fadeIn]
          (click)="$event.stopPropagation()"
        >
          <h2
            id="demo-modal-title"
            class="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Wersja demonstracyjna
          </h2>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ demoText }}
          </p>
          <button
            #closeButtonRef
            (click)="demoModeService.close()"
            class="mt-2 px-6 py-2 bg-hydraulik-navy text-white rounded-lg font-medium hover:bg-hydraulik-navy-dark transition-colors self-end"
          >
            Zamknij
          </button>
        </div>
      </div>
    }
  `,
})
export class DemoModalComponent {
  protected readonly demoModeService = inject(DemoModeService);
  protected readonly demoText = DEMO_TEXT;
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('dialogRef') private readonly dialogRef?: ElementRef<HTMLElement>;
  @ViewChild('closeButtonRef') private readonly closeButtonRef?: ElementRef<HTMLButtonElement>;

  private previouslyFocusedElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const isOpen = this.demoModeService.modalOpen();
      if (!isPlatformBrowser(this.platformId)) return;

      if (isOpen) {
        this.previouslyFocusedElement = document.activeElement as HTMLElement | null;
        // Wait for the dialog to render before moving focus into it.
        queueMicrotask(() => {
          (this.closeButtonRef?.nativeElement ?? this.dialogRef?.nativeElement)?.focus();
        });
      } else if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.demoModeService.modalOpen()) {
      this.demoModeService.close();
    }
  }
}
