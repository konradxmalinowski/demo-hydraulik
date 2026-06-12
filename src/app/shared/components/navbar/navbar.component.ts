import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  signal,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  animations: [
    trigger('drawerSlide', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('250ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
         [class.bg-white]="scrolled() && !isDark()"
         [class.bg-gray-900]="scrolled() && isDark()"
         [class.bg-transparent]="!scrolled()"
         [class.backdrop-blur-md]="scrolled()"
         [class.shadow-md]="scrolled()"
         role="navigation"
         aria-label="Główna nawigacja">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2 font-bold text-xl">
          <span class="text-blue-500">HydroFix</span>
          <span class="text-sm font-normal opacity-70">24/7</span>
        </a>

        <ul class="hidden md:flex items-center gap-6 list-none m-0 p-0" role="list">
          @for (link of navLinks; track link.path) {
            <li>
              <a [routerLink]="link.path"
                 routerLinkActive="text-blue-500 font-semibold"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                 class="text-sm hover:text-blue-500 transition-colors duration-200 py-1"
                 [class.text-white]="!scrolled() && isHome()"
                 [class.text-gray-800]="(scrolled() || !isHome()) && !isDark()"
                 [class.text-gray-100]="(scrolled() || !isHome()) && isDark()">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <div class="flex items-center gap-3">
          <button (click)="toggleDarkMode()"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  [attr.aria-label]="isDark() ? 'Tryb jasny' : 'Tryb ciemny'">
            @if (isDark()) {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 5a7 7 0 100 14A7 7 0 0012 5z"/></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>
            }
          </button>

          <a routerLink="/kontakt"
             class="hidden md:inline-flex items-center gap-1 bg-[#1E3A5F] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#163059] transition-colors">
            Zgłoś awarię
          </a>

          <button class="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  (click)="toggleMobileMenu()"
                  [attr.aria-expanded]="mobileOpen()"
                  aria-controls="mobile-menu"
                  aria-label="Menu nawigacyjne">
            @if (mobileOpen()) {
              <span class="block w-6 text-center" aria-hidden="true">×</span>
            } @else {
              <span class="flex flex-col gap-1" aria-hidden="true">
                <span class="block w-6 h-0.5 bg-current"></span>
                <span class="block w-6 h-0.5 bg-current"></span>
                <span class="block w-6 h-0.5 bg-current"></span>
              </span>
            }
          </button>
        </div>
      </div>
    </nav>

    @if (mobileOpen()) {
      <div class="fixed inset-0 bg-black/50 z-40 md:hidden"
           (click)="closeMobileMenu()"
           aria-hidden="true"></div>

      <div id="mobile-menu"
           role="dialog"
           aria-modal="true"
           aria-label="Menu mobilne"
           class="fixed top-0 right-0 bottom-0 w-72 z-50 md:hidden flex flex-col shadow-xl"
           [class.bg-white]="!isDark()"
           [class.bg-gray-900]="isDark()"
           [@drawerSlide]>
        <div class="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
          <span class="font-bold text-blue-500">Menu</span>
          <button (click)="closeMobileMenu()"
                  class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Zamknij menu">
            <span aria-hidden="true" class="text-xl">×</span>
          </button>
        </div>

        <ul class="flex-1 flex flex-col p-4 gap-1 list-none m-0 overflow-y-auto" role="list">
          @for (link of navLinks; track link.path) {
            <li>
              <a [routerLink]="link.path"
                 (click)="closeMobileMenu()"
                 routerLinkActive="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                 [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                 class="flex items-center px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <a routerLink="/kontakt"
             (click)="closeMobileMenu()"
             class="flex items-center justify-center gap-2 w-full bg-[#1E3A5F] text-white px-4 py-3 rounded-full font-medium hover:bg-[#163059] transition-colors">
            Zgłoś awarię
          </a>
        </div>
      </div>
    }
  `,
})
export class NavbarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  readonly scrolled = signal(false);
  readonly mobileOpen = signal(false);
  readonly isDark = signal(false);
  /** Only the home page has a dark hero behind the transparent navbar */
  readonly isHome = signal(true);

  readonly navLinks: NavLink[] = [
    { label: 'Start', path: '/' },
    { label: 'Kalkulator', path: '/kalkulator' },
    { label: 'Realizacje', path: '/galeria' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Kontakt', path: '/kontakt' },
  ];

  constructor() {
    this.isHome.set(this.isHomeUrl(this.router.url));
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHome.set(this.isHomeUrl(event.urlAfterRedirects));
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('hydraulik-dark-mode');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = saved !== null ? saved === 'true' : prefersDark;
      this.isDark.set(dark);
      this.applyDarkMode(dark);
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrolled.set(window.scrollY > 20);
    }
  }

  toggleDarkMode(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('hydraulik-dark-mode', String(next));
      this.applyDarkMode(next);
    }
  }

  toggleMobileMenu(): void {
    const next = !this.mobileOpen();
    this.mobileOpen.set(next);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = next ? 'hidden' : '';
    }
  }

  closeMobileMenu(): void {
    this.mobileOpen.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  private isHomeUrl(url: string): boolean {
    return url.split('?')[0].split('#')[0] === '/';
  }

  private applyDarkMode(dark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark', dark);
    }
  }
}
