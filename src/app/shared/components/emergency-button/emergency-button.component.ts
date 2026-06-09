import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import { DemoModeService } from '../../../core/services/demo-mode.service';

@Component({
  selector: 'app-emergency-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styles: [`
    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 0.8; }
      70% { transform: scale(1.4); opacity: 0; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    .pulse-ring::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: inherit;
      background-color: #F97316;
      animation: pulse-ring 1.8s ease-out infinite;
      z-index: -1;
    }
    .pulse-btn {
      position: relative;
      background-color: #F97316;
    }
    /* Sticky bar on mobile */
    .emergency-sticky {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 30;
      background-color: #F97316;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 -4px 16px rgba(249,115,22,0.4);
    }
  `],
  template: `
    @if (variant === 'inline') {
      <!-- Inline version used in hero -->
      <button
        class="pulse-btn pulse-ring inline-flex items-center gap-3 px-6 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:bg-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
        (click)="onEmergencyClick()"
        type="button"
        aria-label="Zgłoś awarię hydrauliczną"
      >
        <span class="text-2xl" aria-hidden="true">🚨</span>
        <span>{{ label }}</span>
      </button>
    } @else if (variant === 'sticky') {
      <!-- Sticky bottom bar on mobile -->
      <div class="emergency-sticky md:hidden" role="complementary" aria-label="Zgłoszenie awarii">
        <button
          class="inline-flex items-center gap-2 text-white font-bold text-base w-full justify-center"
          (click)="onEmergencyClick()"
          type="button"
          aria-label="Zgłoś awarię hydrauliczną"
        >
          <span class="text-xl animate-bounce" aria-hidden="true">🚨</span>
          <span>{{ label }}</span>
        </button>
      </div>
    } @else {
      <!-- Default: full width prominent button -->
      <div class="relative inline-block">
        <button
          class="pulse-btn pulse-ring flex items-center gap-3 px-8 py-5 rounded-full text-white font-bold text-xl shadow-xl hover:bg-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
          (click)="onEmergencyClick()"
          type="button"
          aria-label="Zgłoś awarię hydrauliczną"
        >
          <span class="text-3xl" aria-hidden="true">🚨</span>
          <span>{{ label }}</span>
        </button>
      </div>
    }
  `,
})
export class EmergencyButtonComponent {
  @Input() label = 'Zgłoś awarię';
  @Input() variant: 'inline' | 'sticky' | 'default' = 'inline';

  readonly demoMode = inject(DemoModeService);

  onEmergencyClick(): void {
    this.demoMode.open();
  }
}
