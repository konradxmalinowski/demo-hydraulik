import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemoModeService } from '../../core/services/demo-mode.service';
import { SeoService } from '../../core/services/seo.service';
import { CalculatorSignals } from './calculator.signals';
import { ServiceType, PRICING_RATES } from '../../data/pricing.data';

type Step = 1 | 2 | 3;

@Component({
  selector: 'app-calculator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <section class="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold mb-3">Kalkulator Wyceny</h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg">Otrzymaj orientacyjną wycenę w kilka kroków</p>
        </div>

        <!-- Step progress -->
        <div class="flex items-center justify-center gap-2 mb-10"
             role="progressbar"
             aria-label="Postęp formularza"
             [attr.aria-valuemin]="1"
             [attr.aria-valuemax]="3"
             [attr.aria-valuenow]="step()"
             [attr.aria-valuetext]="'Krok ' + step() + ' z 3'">
          @for (s of [1, 2, 3]; track s) {
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors" [class.bg-hydraulik-navy]="step() >= s" [class.text-white]="step() >= s" [class.bg-gray-200]="step() < s" [class.text-gray-500]="step() < s">
                {{ s }}
              </div>
              @if (s < 3) {
                <div class="w-12 h-0.5 transition-colors" [class.bg-hydraulik-steel]="step() > s" [class.bg-gray-200]="step() <= s"></div>
              }
            </div>
          }
        </div>

        <div class="grid md:grid-cols-2 gap-8 items-start">
          <!-- Left: form steps -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">

            <!-- Step 1: Service type -->
            @if (step() === 1) {
              <div>
                <h2 class="text-2xl font-bold mb-2">Krok 1: Rodzaj usługi</h2>
                <p class="text-gray-500 dark:text-gray-400 mb-6">Wybierz typ prac do wykonania</p>

                <div class="grid grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="Rodzaj usługi">
                  @for (opt of serviceOptions; track opt.value) {
                    <button (click)="setServiceType(opt.value)" type="button" role="radio" class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left" [class.border-hydraulik-steel]="calc.serviceType() === opt.value" [class.bg-blue-50]="calc.serviceType() === opt.value" [class.text-hydraulik-navy]="calc.serviceType() === opt.value" [class.border-gray-400]="calc.serviceType() !== opt.value" [class.dark:border-gray-200]="calc.serviceType() !== opt.value" [attr.aria-checked]="calc.serviceType() === opt.value">
                      <span class="font-semibold text-sm">{{ opt.label }}</span>
                    </button>
                  }
                </div>

                <!-- Urgent toggle -->
                <div class="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800 mb-6">
                  <div>
                    <p class="font-medium">Pilna interwencja</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Przyjazd do 45 minut (+50 zł)</p>
                  </div>
                  <button (click)="calc.urgent.set(!calc.urgent())" role="switch" [attr.aria-checked]="calc.urgent()" class="relative w-12 h-6 rounded-full transition-colors" [class.bg-hydraulik-navy]="calc.urgent()" [class.bg-gray-300]="!calc.urgent()">
                    <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-6]="calc.urgent()"></span>
                  </button>
                </div>

                <button (click)="goStep(2)" class="w-full bg-hydraulik-navy text-white py-3 rounded-xl font-semibold hover:bg-hydraulik-navy-dark transition-colors">
                  Dalej
                </button>
              </div>
            }

            <!-- Step 2: Scope -->
            @if (step() === 2) {
              <div>
                <h2 class="text-2xl font-bold mb-2">Krok 2: Zakres prac</h2>
                <p class="text-gray-500 dark:text-gray-400 mb-6">Określ zakres i przewidywany czas pracy</p>

                <!-- Hours slider -->
                <div class="mb-6">
                  <label class="block text-sm font-medium mb-2" for="hours-slider">
                    Szacowany czas pracy: <span class="text-blue-500 font-bold">{{ calc.hoursCount() }} godz.</span>
                  </label>
                  <input id="hours-slider" type="range" min="1" max="8" step="1" [value]="calc.hoursCount()" (input)="setHours($event)" class="w-full accent-blue-500" />
                  <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1h</span><span>4h</span><span>8h</span>
                  </div>
                </div>

                <!-- Extra materials toggle -->
                <div class="flex items-center justify-between py-3 border-t border-b border-gray-100 dark:border-gray-800 mb-6">
                  <div>
                    <p class="font-medium">Materiały instalacyjne</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Rury, złączki, uszczelki (+100 zł)</p>
                  </div>
                  <button (click)="calc.extraMaterials.set(!calc.extraMaterials())" role="switch" [attr.aria-checked]="calc.extraMaterials()" class="relative w-12 h-6 rounded-full transition-colors" [class.bg-hydraulik-navy]="calc.extraMaterials()" [class.bg-gray-300]="!calc.extraMaterials()">
                    <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-6]="calc.extraMaterials()"></span>
                  </button>
                </div>

                <div class="flex gap-3">
                  <button (click)="goStep(1)" class="flex-1 border border-gray-300 dark:border-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Wstecz
                  </button>
                  <button (click)="goStep(3)" class="flex-1 bg-hydraulik-navy text-white py-3 rounded-xl font-semibold hover:bg-hydraulik-navy-dark transition-colors">
                    Dalej
                  </button>
                </div>
              </div>
            }

            <!-- Step 3: Contact & submit -->
            @if (step() === 3) {
              <div>
                <h2 class="text-2xl font-bold mb-2">Krok 3: Dane kontaktowe</h2>
                <p class="text-gray-500 dark:text-gray-400 mb-6">Wyślij zapytanie - oddzwonimy w ciągu 15 minut</p>

                <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1" for="calc-name">Imię *</label>
                    <input id="calc-name" formControlName="name" type="text" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jan" />
                    @if (contactForm.get('name')?.invalid && contactForm.get('name')?.touched) {
                      <p class="text-red-500 text-xs mt-1">Imię jest wymagane</p>
                    }
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1" for="calc-phone">Telefon *</label>
                    <input id="calc-phone" formControlName="phone" type="tel" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+48 xxx xxx xxx" />
                    @if (contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched) {
                      <p class="text-red-500 text-xs mt-1">Podaj prawidłowy numer telefonu</p>
                    }
                  </div>

                  <div class="flex gap-3 mt-2">
                    <button type="button" (click)="goStep(2)" class="flex-1 border border-gray-300 dark:border-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Wstecz
                    </button>
                    <button type="submit" class="flex-1 bg-hydraulik-navy text-white py-3 rounded-xl font-semibold hover:bg-hydraulik-navy-dark transition-colors">
                      Wyślij zapytanie
                    </button>
                  </div>
                </form>
              </div>
            }
          </div>

          <!-- Right: LCD price display -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 font-mono sticky top-24">
            <div class="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest mb-6 text-center">Wycena - Panel LCD</div>

            <div class="space-y-4">
              @for (row of priceRows(); track row.label) {
                <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700/50 last:border-0">
                  <span class="text-gray-600 dark:text-gray-400 text-sm">{{ row.label }}</span>
                  <span class="text-xl font-bold tabular-nums text-green-700 dark:text-green-400">{{ row.value }} zł</span>
                </div>
              }
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <span class="text-gray-700 dark:text-gray-300 font-semibold text-lg">RAZEM</span>
                <span class="text-3xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">{{ calc.razem() }} zł</span>
              </div>
              <p class="text-gray-500 text-xs mt-2 text-center">* Wycena orientacyjna. Ostateczna cena po oględzinach.</p>
            </div>

            <div class="mt-4 text-center">
              <span class="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {{ currentServiceLabel() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CalculatorComponent implements OnInit {
  readonly demoMode = inject(DemoModeService);
  private readonly seoService = inject(SeoService);
  private readonly fb = inject(FormBuilder);

  readonly calc = new CalculatorSignals();
  readonly step = signal<Step>(1);

  readonly contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d\s-]{9,15}$/)]],
  });

  readonly serviceOptions: { value: ServiceType; label: string; icon: string }[] = [
    { value: 'awaria', label: 'Naprawa awarii', icon: '' },
    { value: 'montaz', label: 'Montaż armatury', icon: '' },
    { value: 'wymiana', label: 'Wymiana elementów', icon: '' },
    { value: 'instalacja', label: 'Nowa instalacja', icon: '' },
  ];

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Kalkulator Wyceny',
      description: 'Oblicz orientacyjny koszt usługi hydraulicznej. Kalkulator wyceny - dojazd, robocizna, materiały.',
      url: '/kalkulator',
    });
  }

  priceRows() {
    return [
      { label: 'Dojazd', value: this.calc.dojazd() },
      { label: 'Robocizna', value: this.calc.robocizna() },
      { label: 'Materiały', value: this.calc.materialy() },
    ];
  }

  currentServiceLabel(): string {
    return PRICING_RATES[this.calc.serviceType()].label;
  }

  setServiceType(type: ServiceType): void {
    this.calc.serviceType.set(type);
  }

  setHours(event: Event): void {
    this.calc.hoursCount.set(Number((event.target as HTMLInputElement).value));
  }

  goStep(s: number): void {
    this.step.set(s as Step);
  }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.valid) {
      this.demoMode.open();
    }
  }
}
