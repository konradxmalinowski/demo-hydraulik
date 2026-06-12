import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { SeoService } from '../../core/services/seo.service';
import { FAQ_ITEMS, FAQ_CATEGORIES, FaqCategory } from '../../data/faq.data';

@Component({
  selector: 'app-faq',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  animations: [
    trigger('accordion', [
      state('open', style({ height: '*', opacity: 1 })),
      state('closed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      transition('open <=> closed', animate('300ms ease-in-out')),
    ]),
  ],
  template: `
    <section class="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold mb-3">Często zadawane pytania</h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg">Znajdź szybką odpowiedź na swoje pytanie</p>
        </div>

        <!-- Search -->
        <div class="relative mb-8">
          <input [formControl]="searchControl"
                 type="search"
                 placeholder="Szukaj pytania..."
                 class="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                 aria-label="Wyszukaj pytanie" />
        </div>

        <!-- Category tabs -->
        <div class="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filtruj pytania według kategorii">
          <button (click)="setCategory(null)" class="px-4 py-2 rounded-full text-sm font-medium transition-colors" [class.bg-hydraulik-navy]="!activeCategory()" [class.text-white]="!activeCategory()" [class.bg-white]="activeCategory() !== null" [class.dark:bg-gray-800]="activeCategory() !== null" [class.text-gray-700]="activeCategory() !== null" [class.dark:text-gray-300]="activeCategory() !== null" [attr.aria-pressed]="!activeCategory()">
            Wszystkie
          </button>
          @for (cat of categories; track cat) {
            <button (click)="setCategory(cat)" class="px-4 py-2 rounded-full text-sm font-medium transition-colors" [class.bg-hydraulik-navy]="activeCategory() === cat" [class.text-white]="activeCategory() === cat" [class.bg-white]="activeCategory() !== cat" [class.dark:bg-gray-800]="activeCategory() !== cat" [class.text-gray-700]="activeCategory() !== cat" [class.dark:text-gray-300]="activeCategory() !== cat" [attr.aria-pressed]="activeCategory() === cat">
              {{ cat }}
            </button>
          }
        </div>

        <!-- FAQ accordion grouped by category -->
        @if (filteredItems().length === 0) {
          <div class="text-center py-12 text-gray-500">
            Nie znaleziono pytań pasujących do wyszukiwania.
          </div>
        } @else {
          @for (group of groupedItems(); track group.category) {
            <div class="mb-8">
              <h2 class="text-lg font-bold text-hydraulik-navy dark:text-blue-400 mb-3 flex items-center gap-2">
                <span class="w-px h-5 bg-hydraulik-steel" aria-hidden="true"></span>
                {{ group.category }}
              </h2>

              <div class="space-y-2">
                @for (item of group.items; track item.id) {
                  <div class="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
                    <button (click)="toggle(item.id)"
                            class="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            [attr.aria-expanded]="isOpen(item.id)"
                            [attr.aria-controls]="'faq-answer-' + item.id">
                      <span class="pr-4">{{ item.question }}</span>
                      <span class="flex-shrink-0 text-blue-500 text-xl transition-transform" [class.rotate-45]="isOpen(item.id)" aria-hidden="true">+</span>
                    </button>

                    <div [id]="'faq-answer-' + item.id"
                         role="region"
                         [@accordion]="isOpen(item.id) ? 'open' : 'closed'"
                         class="overflow-hidden">
                      <div class="px-5 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                        {{ item.answer }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }

        <!-- CTA -->
        <div class="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 text-center">
          <h3 class="font-bold text-lg mb-2">Nie znalazłeś odpowiedzi?</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Skontaktuj się z nami bezpośrednio — odpiszemy w ciągu godziny.</p>
          <a href="tel:+48123456789" class="inline-flex items-center gap-2 bg-hydraulik-navy text-white px-6 py-3 rounded-full font-semibold hover:bg-hydraulik-navy-dark transition-colors">
            +48 123 456 789
          </a>
        </div>
      </div>
    </section>
  `,
})
export class FaqComponent implements OnInit, OnDestroy {
  private readonly seoService = inject(SeoService);
  private searchSub?: Subscription;

  readonly categories = FAQ_CATEGORIES;
  readonly allItems = FAQ_ITEMS;
  readonly activeCategory = signal<FaqCategory | null>(null);
  readonly openIds = signal<Set<number>>(new Set());

  // Signal-backed search so computed() tracks it reactively
  readonly searchQuery = signal('');
  readonly searchControl = new FormControl('');

  readonly filteredItems = computed(() => {
    const cat = this.activeCategory();
    const query = this.searchQuery().toLowerCase();
    return this.allItems.filter(item => {
      const matchCat = cat === null || item.category === cat;
      const matchQuery = !query || item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  });

  readonly groupedItems = computed(() => {
    const items = this.filteredItems();
    const groups: { category: FaqCategory; items: typeof items }[] = [];
    for (const cat of this.categories) {
      const catItems = items.filter(i => i.category === cat);
      if (catItems.length > 0) {
        groups.push({ category: cat, items: catItems });
      }
    }
    return groups;
  });

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'FAQ — Często Zadawane Pytania',
      description: 'Odpowiedzi na najczęstsze pytania dotyczące usług hydraulicznych: płatności, awarie, zakres prac, gwarancja. HydroFix Kraków.',
      url: '/faq',
    });

    // Bridge FormControl changes into the Signal so computed() reacts
    this.searchSub = this.searchControl.valueChanges.subscribe(val => {
      this.searchQuery.set(val ?? '');
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  setCategory(cat: FaqCategory | null): void {
    this.activeCategory.set(cat);
  }

  toggle(id: number): void {
    const current = new Set(this.openIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.openIds.set(current);
  }

  isOpen(id: number): boolean {
    return this.openIds().has(id);
  }
}
