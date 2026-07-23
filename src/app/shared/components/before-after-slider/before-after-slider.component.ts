import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  ViewChild,
  signal,
  OnDestroy,
  inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-before-after-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .slider-container {
      position: relative;
      overflow: hidden;
      cursor: col-resize;
      user-select: none;
      -webkit-user-select: none;
    }
    .after-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 3px;
      background: white;
      transform: translateX(-50%);
      cursor: col-resize;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .handle-button {
      position: absolute;
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      font-size: 16px;
    }
    .label {
      position: absolute;
      bottom: 8px;
      padding: 2px 8px;
      background: rgba(0,0,0,0.5);
      color: white;
      font-size: 11px;
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  `],
  template: `
    <div #container
         class="slider-container rounded-xl overflow-hidden aspect-video bg-gray-200 dark:bg-gray-800"
         [style.height]="height"
         (mousedown)="onMouseDown($event)"
         (touchstart)="onTouchStart($event)"
         role="img"
         [attr.aria-label]="'Zdjęcie przed i po: ' + (title || 'realizacja')">

      <!-- Before image (full width) -->
      <picture>
        @if (beforeSrcsetWebp) {
          <source type="image/webp" [srcset]="beforeSrcsetWebp" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        }
        @if (beforeSrcsetJpg) {
          <source type="image/jpeg" [srcset]="beforeSrcsetJpg" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        }
        <img [src]="beforeSrc"
             [alt]="beforeAlt || 'Przed'"
             class="w-full h-full object-cover"
             width="1200" height="675"
             loading="lazy" />
      </picture>

      <!-- After image revealed by clip-path -->
      <picture class="after-img" [style.clip-path]="clipPath()">
        @if (afterSrcsetWebp) {
          <source type="image/webp" [srcset]="afterSrcsetWebp" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        }
        @if (afterSrcsetJpg) {
          <source type="image/jpeg" [srcset]="afterSrcsetJpg" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        }
        <img #afterImg
             [src]="afterSrc"
             [alt]="afterAlt || 'Po'"
             class="w-full h-full object-cover"
             width="1200" height="675"
             loading="lazy" />
      </picture>

      <!-- Labels -->
      <span class="label" style="left: 8px">Przed</span>
      <span class="label" style="right: 8px">Po</span>

      <!-- Drag handle -->
      <div class="handle" [style.left]="position() + '%'">
        <div class="handle-button">&#8596;</div>
      </div>
    </div>
  `,
})
export class BeforeAfterSliderComponent implements AfterViewInit, OnDestroy {
  @Input() beforeSrc = '';
  @Input() afterSrc = '';
  @Input() beforeSrcsetWebp = '';
  @Input() beforeSrcsetJpg = '';
  @Input() afterSrcsetWebp = '';
  @Input() afterSrcsetJpg = '';
  @Input() beforeAlt = 'Przed';
  @Input() afterAlt = 'Po';
  @Input() title = '';
  @Input() height = '300px';

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);

  readonly position = signal(50); // percentage 0-100

  readonly clipPath = () => `inset(0 0 0 ${this.position()}%)`;

  private dragging = false;
  private readonly boundMouseMove = this.onMouseMove.bind(this);
  private readonly boundMouseUp = this.onMouseUp.bind(this);
  private readonly boundTouchMove = this.onTouchMove.bind(this);
  private readonly boundTouchEnd = this.onTouchEnd.bind(this);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.boundMouseMove);
      document.addEventListener('mouseup', this.boundMouseUp);
      document.addEventListener('touchmove', this.boundTouchMove, { passive: false });
      document.addEventListener('touchend', this.boundTouchEnd);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.boundMouseMove);
      document.removeEventListener('mouseup', this.boundMouseUp);
      document.removeEventListener('touchmove', this.boundTouchMove);
      document.removeEventListener('touchend', this.boundTouchEnd);
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.dragging = true;
    this.updatePosition(event.clientX);
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.dragging) return;
    this.updatePosition(event.clientX);
  }

  onMouseUp(): void {
    this.dragging = false;
  }

  onTouchStart(event: TouchEvent): void {
    this.dragging = true;
    if (event.touches[0]) {
      this.updatePosition(event.touches[0].clientX);
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.dragging) return;
    if (event.touches[0]) {
      this.updatePosition(event.touches[0].clientX);
      event.preventDefault(); // prevent page scroll while dragging
    }
  }

  onTouchEnd(): void {
    this.dragging = false;
  }

  private updatePosition(clientX: number): void {
    if (!this.containerRef) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, raw));
    this.position.set(clamped);
  }
}
