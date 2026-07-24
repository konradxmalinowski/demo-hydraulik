import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { EmergencyButtonComponent } from '../../shared/components/emergency-button/emergency-button.component';
import { HYDRAULIK_SERVICES } from '../../data/services.data';
import { TESTIMONIALS } from '../../data/testimonials.data';
import { FAQ_ITEMS } from '../../data/faq.data';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, EmergencyButtonComponent],
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    .animate-delay-1 { animation-delay: 0.1s; opacity: 0; }
    .animate-delay-2 { animation-delay: 0.2s; opacity: 0; }
    .animate-delay-3 { animation-delay: 0.3s; opacity: 0; }
    .animate-delay-4 { animation-delay: 0.4s; opacity: 0; }

    .trust-tile {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .trust-tile.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .skeleton {
      background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center bg-gradient-to-br from-hydraulik-ink via-hydraulik-navy to-hydraulik-ink text-white overflow-hidden">
      <div class="relative max-w-6xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <!-- Dyżur badge -->
          <div class="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Dyżur aktywny - dojazd ok. {{ arrivalTime() }} min (demo)
          </div>

          <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up animate-delay-1">
            Hydraulik<br />
            <span class="text-blue-400">na ratunek</span><br />
            24/7
          </h1>

          <p class="text-xl text-gray-300 mb-8 leading-relaxed animate-fade-in-up animate-delay-2">
            Pogotowie hydrauliczne w Krakowie i okolicach. Przyjedziemy do Ciebie w 30-45 minut od zgłoszenia - również w nocy i w weekendy.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-3">
            <a routerLink="/kalkulator" class="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
              Zamów usługę
            </a>
            <app-emergency-button label="Zgłoś awarię" variant="inline" />
          </div>
        </div>

        <!-- Trust stats (right column) -->
        <div class="grid grid-cols-2 gap-4 animate-fade-in-up animate-delay-4">
          @for (stat of heroStats; track stat.value) {
            <div class="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <div class="text-4xl font-extrabold text-blue-400">{{ stat.value }}</div>
              <div class="text-sm text-gray-300 mt-1">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Trust tiles section (with scroll animations) -->
    <section class="py-20 px-4 bg-white dark:bg-gray-900">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Dlaczego HydroFix?</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6" #trustGrid data-trust-section>
          @for (tile of trustTiles; track tile.icon) {
            <div class="trust-tile text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800" [class.visible]="trustVisible()">
              <div class="font-bold text-lg text-blue-500 mb-1">{{ tile.value }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ tile.label }}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Services grid -->
    <section class="py-20 px-4 bg-gray-50 dark:bg-gray-950">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-3">Nasze usługi</h2>
          <p class="text-gray-600 dark:text-gray-400">Kompleksowe rozwiązania hydrauliczne dla domu i firmy</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (svc of services; track svc.id) {
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <h3 class="font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors">{{ svc.name }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{{ svc.description }}</p>
              <a routerLink="/kontakt" class="text-blue-500 font-medium text-sm hover:underline">
                Zamów usługę →
              </a>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- @defer: Testimonials section -->
    @defer (hydrate on viewport) {
      <section class="py-20 px-4 bg-white dark:bg-gray-900">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-3">Opinie klientów</h2>
            <p class="text-gray-600 dark:text-gray-400">Co mówią nasi klienci</p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (t of testimonials; track t.name) {
              <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                <div class="flex items-center gap-1 mb-3" [attr.aria-label]="'Ocena: ' + t.rating + ' na 5'">
                  @for (star of starsFor(t.rating); track $index) {
                    <span class="text-yellow-400">★</span>
                  }
                </div>
                <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">"{{ t.text }}"</p>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    {{ t.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold text-sm">{{ t.name }}</p>
                    <p class="text-gray-500 text-xs">{{ t.city }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    } @placeholder {
      <section class="py-20 px-4 bg-white dark:bg-gray-900">
        <div class="max-w-6xl mx-auto">
          <div class="skeleton h-8 w-48 rounded-lg mx-auto mb-12"></div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1, 2, 3]; track i) {
              <div class="rounded-2xl p-6 bg-gray-50 dark:bg-gray-800">
                <div class="skeleton h-4 w-24 rounded mb-3"></div>
                <div class="skeleton h-16 w-full rounded mb-4"></div>
                <div class="skeleton h-4 w-32 rounded"></div>
              </div>
            }
          </div>
        </div>
      </section>
    }

    <!-- @defer: Map/area section -->
    @defer (hydrate on viewport) {
      <section class="py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-3">Obszar działania</h2>
            <p class="text-gray-600 dark:text-gray-400">Obsługujemy Kraków i okolice w promieniu 30 km</p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 items-center">
            <!-- Map iframe placeholder -->
            <div class="rounded-2xl overflow-hidden shadow-md aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=19.7%2C49.9%2C20.2%2C50.2&layer=mapnik&marker=50.0647%2C19.9450"
                class="w-full h-full border-0"
                loading="lazy"
                title="Mapa obszaru działania HydroFix Kraków"
                aria-label="Mapa: Kraków i okolice - obszar działania hydraulika"
              ></iframe>
            </div>

            <div>
              <h3 class="font-bold text-xl mb-4">Działamy w:</h3>
              <ul class="grid grid-cols-2 gap-2">
                @for (city of serviceCities; track city) {
                  <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span class="text-blue-500">✓</span>
                    {{ city }}
                  </li>
                }
              </ul>
              <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p class="text-blue-800 dark:text-blue-300 text-sm font-medium">
                  Poza obszarem? Zadzwoń - często możemy dojechać dalej.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    } @placeholder {
      <section class="py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div class="max-w-6xl mx-auto">
          <div class="skeleton h-8 w-48 rounded-lg mx-auto mb-12"></div>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="skeleton aspect-video rounded-2xl"></div>
            <div class="space-y-3">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="skeleton h-4 w-full rounded"></div>
              }
            </div>
          </div>
        </div>
      </section>
    }

    <!-- @defer: FAQ preview section -->
    @defer (hydrate on viewport) {
      <section class="py-20 px-4 bg-white dark:bg-gray-900">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-3">Najczęstsze pytania</h2>
            <p class="text-gray-600 dark:text-gray-400">Szybkie odpowiedzi na najważniejsze pytania</p>
          </div>

          <div class="space-y-3">
            @for (item of faqPreview; track item.id) {
              <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <h3 class="font-semibold mb-2 text-gray-900 dark:text-white">{{ item.question }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ item.answer }}</p>
              </div>
            }
          </div>

          <div class="text-center mt-8">
            <a routerLink="/faq" class="inline-flex items-center gap-2 bg-hydraulik-navy text-white px-6 py-3 rounded-full font-semibold hover:bg-hydraulik-navy-dark transition-colors">
              Wszystkie pytania →
            </a>
          </div>
        </div>
      </section>
    } @placeholder {
      <section class="py-20 px-4 bg-white dark:bg-gray-900">
        <div class="max-w-4xl mx-auto">
          <div class="skeleton h-8 w-48 rounded-lg mx-auto mb-12"></div>
          <div class="space-y-3">
            @for (i of [1, 2, 3]; track i) {
              <div class="rounded-xl p-5 bg-gray-50 dark:bg-gray-800">
                <div class="skeleton h-4 w-3/4 rounded mb-2"></div>
                <div class="skeleton h-12 w-full rounded"></div>
              </div>
            }
          </div>
        </div>
      </section>
    }

    <!-- @defer: Gallery preview -->
    @defer (hydrate on viewport) {
      <section class="py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-3">Nasze realizacje</h2>
            <p class="text-gray-600 dark:text-gray-400">Kilka przykładów naszych prac</p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div class="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                </div>
                <div class="p-4">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">Realizacja {{ i }}</div>
                  <div class="text-xs text-gray-500 mt-1">Szczegóły w galerii</div>
                </div>
              </div>
            }
          </div>

          <div class="text-center mt-8">
            <a routerLink="/galeria" class="inline-flex items-center gap-2 border border-hydraulik-steel text-hydraulik-steel px-6 py-3 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
              Zobacz wszystkie realizacje →
            </a>
          </div>
        </div>
      </section>
    } @placeholder {
      <section class="py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div class="max-w-6xl mx-auto">
          <div class="skeleton h-8 w-48 rounded-lg mx-auto mb-12"></div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1, 2, 3]; track i) {
              <div class="rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
                <div class="skeleton aspect-video"></div>
                <div class="p-4 space-y-2">
                  <div class="skeleton h-4 w-3/4 rounded"></div>
                  <div class="skeleton h-3 w-1/2 rounded"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    }

    <!-- CTA Section -->
    <section class="py-20 px-4 bg-hydraulik-navy text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-extrabold mb-4">Masz awarię? Działamy 24/7!</h2>
        <p class="text-xl text-blue-100 mb-8">Nie czekaj - każda chwila może kosztować więcej. Zadzwoń lub wyślij zgłoszenie online.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+48123456789" class="inline-flex items-center justify-center gap-2 bg-white text-hydraulik-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors">
            +48 123 456 789
          </a>
          <a routerLink="/kontakt" class="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
            Formularz online
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly trustVisible = signal(false);
  readonly arrivalTime = signal(0);

  readonly services = HYDRAULIK_SERVICES;
  readonly testimonials = TESTIMONIALS;
  readonly faqPreview = FAQ_ITEMS.slice(0, 3);

  readonly heroStats = [
    { value: '15+', label: 'lat doświadczenia' },
    { value: '24/7', label: 'pogotowie' },
    { value: '500+', label: 'realizacji' },
    { value: '2 lata', label: 'gwarancji' },
  ];

  readonly trustTiles = [
    { icon: '', value: '15+ lat', label: 'doświadczenia' },
    { icon: '', value: '24/7', label: 'pogotowie hydrauliczne' },
    { icon: '', value: '500+', label: 'zrealizowanych zleceń' },
    { icon: '', value: '2 lata', label: 'gwarancji na prace' },
  ];

  readonly serviceCities = [
    'Kraków', 'Wieliczka', 'Skawina', 'Myślenice',
    'Niepołomice', 'Proszowice', 'Nowa Huta', 'Bochnia',
  ];

  starsFor(rating: number): number[] {
    return Array(rating).fill(0);
  }

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Hydraulik Kraków 24/7 - Pogotowie Hydrauliczne',
      description: 'HydroFix to profesjonalne pogotowie hydrauliczne w Krakowie i okolicach. Przyjedziemy w 30-45 minut. Usuwanie awarii, montaż armatury, instalacje wodne. Zadzwoń 24/7.',
      url: '/',
    });

    // Randomize arrival time (demo)
    if (isPlatformBrowser(this.platformId)) {
      this.arrivalTime.set(30 + Math.floor(Math.random() * 16)); // 30-45
    } else {
      this.arrivalTime.set(35);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // IntersectionObserver for trust tiles
    const trustSection = document.querySelector('[data-trust-section]');
    if (trustSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            this.trustVisible.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(trustSection);
    } else {
      // Fallback: show immediately
      this.trustVisible.set(true);
    }
  }
}
