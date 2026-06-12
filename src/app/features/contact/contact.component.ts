import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SeoService } from '../../core/services/seo.service';
import { DemoModeService } from '../../core/services/demo-mode.service';

const DAYS_PL = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .input-base {
      padding: 12px 16px;
      border-radius: 12px;
      border: 1.5px solid #d1d5db;
      background: white;
      font-size: 1rem;
      transition: border-color 0.2s;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }
    .input-base:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }
    .input-error {
      border-color: #ef4444;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 2px;
    }
    .label {
      font-weight: 600;
      font-size: 0.9rem;
      color: #374151;
    }
    :host-context(.dark) .label {
      color: #e5e7eb;
    }
    :host-context(.dark) .input-base {
      background: #1f2937;
      border-color: #374151;
      color: #f9fafb;
    }
    :host-context(.dark) .input-base:focus {
      border-color: #3B82F6;
    }
    .today-highlight {
      background: #1E3A5F;
      color: white;
      border-radius: 6px;
      font-weight: 700;
    }
  `],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4">
      <div class="max-w-6xl mx-auto">

        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-3">Kontakt</h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg">Napisz do nas lub zadzwoń — odpowiemy najszybciej jak to możliwe</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-start">

          <!-- Contact Form -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
            <h2 class="text-2xl font-bold mb-6">Wyślij wiadomość</h2>

            @if (submitted()) {
              <div class="text-center py-8">
                <div class="text-5xl mb-4" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 class="text-xl font-bold mb-2">Wiadomość wysłana!</h3>
                <p class="text-gray-600 dark:text-gray-400">Odezwiemy się najszybciej jak to możliwe.</p>
                <button (click)="resetForm()"
                        class="mt-6 text-blue-500 font-medium hover:underline">
                  Wyślij kolejną wiadomość
                </button>
              </div>
            } @else {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" novalidate class="space-y-5">

                <!-- Name -->
                <div class="form-field">
                  <label for="name" class="label">Imię i nazwisko <span class="text-blue-500">*</span></label>
                  <input id="name"
                         type="text"
                         formControlName="name"
                         class="input-base"
                         [class.input-error]="isInvalid('name')"
                         placeholder="Jan Kowalski"
                         autocomplete="name"
                         aria-describedby="name-error" />
                  @if (isInvalid('name')) {
                    <span id="name-error" class="error-msg" role="alert">
                      {{ getError('name') }}
                    </span>
                  }
                </div>

                <!-- Phone -->
                <div class="form-field">
                  <label for="phone" class="label">Telefon <span class="text-blue-500">*</span></label>
                  <input id="phone"
                         type="tel"
                         formControlName="phone"
                         class="input-base"
                         [class.input-error]="isInvalid('phone')"
                         placeholder="+48 123 456 789"
                         autocomplete="tel"
                         aria-describedby="phone-error" />
                  @if (isInvalid('phone')) {
                    <span id="phone-error" class="error-msg" role="alert">
                      {{ getError('phone') }}
                    </span>
                  }
                </div>

                <!-- Email -->
                <div class="form-field">
                  <label for="email" class="label">E-mail</label>
                  <input id="email"
                         type="email"
                         formControlName="email"
                         class="input-base"
                         [class.input-error]="isInvalid('email')"
                         placeholder="jan@przykład.pl"
                         autocomplete="email"
                         aria-describedby="email-error" />
                  @if (isInvalid('email')) {
                    <span id="email-error" class="error-msg" role="alert">
                      {{ getError('email') }}
                    </span>
                  }
                </div>

                <!-- Service type -->
                <div class="form-field">
                  <label for="serviceType" class="label">Rodzaj usługi <span class="text-blue-500">*</span></label>
                  <select id="serviceType"
                          formControlName="serviceType"
                          class="input-base"
                          [class.input-error]="isInvalid('serviceType')"
                          aria-describedby="serviceType-error">
                    <option value="">-- Wybierz usługę --</option>
                    <option value="awaria">Awaria pilna (przyjedziemy w 30-45 min)</option>
                    <option value="montaz">Montaż armatury</option>
                    <option value="instalacja">Instalacje wodne/kanalizacyjne</option>
                    <option value="ogrzewanie">Ogrzewanie / pompa ciepła</option>
                    <option value="remont">Remont łazienki</option>
                    <option value="inne">Inne</option>
                  </select>
                  @if (isInvalid('serviceType')) {
                    <span id="serviceType-error" class="error-msg" role="alert">
                      Wybierz rodzaj usługi
                    </span>
                  }
                </div>

                <!-- Message -->
                <div class="form-field">
                  <label for="message" class="label">Opis problemu <span class="text-blue-500">*</span></label>
                  <textarea id="message"
                            formControlName="message"
                            class="input-base"
                            [class.input-error]="isInvalid('message')"
                            placeholder="Opisz krótko problem lub zakres prac..."
                            rows="4"
                            aria-describedby="message-error"></textarea>
                  @if (isInvalid('message')) {
                    <span id="message-error" class="error-msg" role="alert">
                      {{ getError('message') }}
                    </span>
                  }
                  <span class="text-xs text-gray-400 text-right">{{ messageLength() }}/500</span>
                </div>

                <!-- RODO consent -->
                <div class="flex items-start gap-3">
                  <input id="consent"
                         type="checkbox"
                         formControlName="consent"
                         class="mt-1 w-4 h-4 accent-blue-500 flex-shrink-0"
                         aria-describedby="consent-error" />
                  <div>
                    <label for="consent" class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                      Wyrażam zgodę na przetwarzanie danych osobowych w celu realizacji zapytania. <span class="text-blue-500">*</span>
                    </label>
                    @if (isInvalid('consent')) {
                      <span id="consent-error" class="error-msg block" role="alert">
                        Zgoda jest wymagana
                      </span>
                    }
                  </div>
                </div>

                <!-- Submit -->
                <button type="submit"
                        class="w-full py-4 rounded-full bg-hydraulik-navy text-white font-bold text-lg hover:bg-hydraulik-navy-dark active:bg-hydraulik-navy-deep transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        [disabled]="submitting()">
                  @if (submitting()) {
                    <span>Wysyłanie...</span>
                  } @else {
                    <span>Wyślij wiadomość</span>
                  }
                </button>

                <p class="text-xs text-gray-400 text-center">
                  To jest wersja demonstracyjna — żadne dane nie są przesyłane.
                </p>
              </form>
            }
          </div>

          <!-- Contact info + Map -->
          <div class="space-y-8">

            <!-- Contact info cards -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
              <h2 class="text-xl font-bold mb-6">Dane kontaktowe</h2>

              <div class="space-y-4">
                <a href="tel:+48123456789"
                   class="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                  <div class="text-2xl" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.06 3.18a1 1 0 01-.23 1.05l-1.4 1.4a16.06 16.06 0 006.29 6.29l1.4-1.4a1 1 0 011.05-.23l3.18 1.06A1 1 0 0121 16.72V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z"/></svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Telefon (24/7)</p>
                    <p class="font-bold text-lg text-hydraulik-navy dark:text-blue-400 group-hover:underline">+48 123 456 789</p>
                  </div>
                </a>

                <a href="mailto:kontakt@hydrofix-krakow.pl"
                   class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                  <div class="text-2xl" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">E-mail</p>
                    <p class="font-semibold group-hover:text-blue-500 transition-colors">kontakt&#64;hydrofix-krakow.pl</p>
                  </div>
                </a>

                <div class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div class="text-2xl" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Adres</p>
                    <p class="font-semibold">ul. Wodna 12, 30-001 Kraków</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hours with today highlighted -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
              <h2 class="text-xl font-bold mb-4">Godziny pracy</h2>
              <div class="space-y-1">
                @for (entry of hours; track entry.day) {
                  <div class="flex justify-between px-3 py-2 rounded-lg text-sm"
                       [class.today-highlight]="entry.isToday">
                    <span class="font-medium">{{ entry.day }}</span>
                    <span>{{ entry.hours }}</span>
                  </div>
                }
              </div>
              <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p class="text-hydraulik-navy dark:text-blue-300 text-sm font-medium text-center">
                  Pogotowie hydrauliczne — dostępne 24/7 przez cały rok
                </p>
              </div>
            </div>

            <!-- Map -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
              <div class="aspect-video">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=19.9%2C50.04%2C20.0%2C50.09&layer=mapnik&marker=50.0647%2C19.9450"
                  class="w-full h-full border-0"
                  loading="lazy"
                  title="Lokalizacja HydroFix Kraków"
                  aria-label="Mapa: ul. Wodna 12, 30-001 Kraków"
                ></iframe>
              </div>
              <div class="p-4 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">ul. Wodna 12, 30-001 Kraków</p>
                <a href="https://www.openstreetmap.org/?mlat=50.0647&mlon=19.9450#map=15/50.0647/19.9450"
                   target="_blank" rel="noopener noreferrer"
                   class="text-blue-500 text-sm hover:underline font-medium">
                  Otwórz w mapach →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly demoMode = inject(DemoModeService);
  private readonly fb = inject(FormBuilder);

  readonly submitting = signal(false);
  readonly submitted = signal(false);

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d\s()-]{7,20}$/)]],
    email: ['', [Validators.email, Validators.maxLength(254)]],
    serviceType: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    consent: [false, Validators.requiredTrue],
  });

  readonly messageLength = computed(() => {
    const val = this.contactForm.get('message')?.value ?? '';
    return (val as string).length;
  });

  readonly hours = this.buildHours();

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Kontakt — Zadzwoń lub Napisz',
      description: 'Skontaktuj się z HydroFix. Pogotowie hydrauliczne 24/7 w Krakowie i okolicach. Telefon, e-mail, formularz kontaktowy. Odpiszemy w ciągu godziny.',
      url: '/kontakt',
    });
  }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) return;

    this.submitting.set(true);

    // Demo mode — no real network request (T-03-H1 mitigation)
    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
      this.demoMode.open();
    }, 600);
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitted.set(false);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.contactForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  getError(field: string): string {
    const ctrl = this.contactForm.get(field);
    if (!ctrl || !ctrl.errors) return '';
    const e = ctrl.errors;
    if (e['required']) return 'To pole jest wymagane';
    if (e['requiredTrue']) return 'Zgoda jest wymagana';
    if (e['minlength']) return `Minimum ${e['minlength'].requiredLength} znaków`;
    if (e['maxlength']) return `Maksimum ${e['maxlength'].requiredLength} znaków`;
    if (e['email']) return 'Podaj prawidłowy adres e-mail';
    if (e['pattern']) return 'Podaj prawidłowy numer telefonu';
    return 'Nieprawidłowa wartość';
  }

  private buildHours(): Array<{ day: string; hours: string; isToday: boolean }> {
    const todayIdx = new Date().getDay(); // 0 = Sunday
    return DAYS_PL.map((day, idx) => ({
      day,
      hours: '00:00 – 23:59',
      isToday: idx === todayIdx,
    }));
  }
}
