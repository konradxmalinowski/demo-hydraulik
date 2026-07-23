import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  OnInit,
  inject,
} from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { BeforeAfterSliderComponent } from '../../shared/components/before-after-slider/before-after-slider.component';
import { GALLERY_ITEMS, GALLERY_CATEGORIES, GalleryCategory } from '../../data/gallery.data';

@Component({
  selector: 'app-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BeforeAfterSliderComponent],
  template: `
    <section class="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold mb-3">Nasze realizacje</h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg">Przesuń suwak aby zobaczyć efekt przed i po</p>
        </div>

        <!-- Category filter -->
        <div class="flex flex-wrap gap-2 justify-center mb-10" role="group" aria-label="Filtruj według kategorii">
          <button (click)="setCategory(null)" class="px-5 py-2 rounded-full text-sm font-medium transition-colors" [class.bg-hydraulik-navy]="!activeCategory()" [class.text-white]="!activeCategory()" [class.bg-white]="activeCategory() !== null" [class.dark:bg-gray-800]="activeCategory() !== null" [class.text-gray-700]="activeCategory() !== null" [class.dark:text-gray-300]="activeCategory() !== null" [class.hover:bg-gray-100]="activeCategory() !== null" [attr.aria-pressed]="!activeCategory()">
            Wszystkie ({{ items.length }})
          </button>
          @for (cat of categories; track cat) {
            <button (click)="setCategory(cat)" class="px-5 py-2 rounded-full text-sm font-medium transition-colors" [class.bg-hydraulik-navy]="activeCategory() === cat" [class.text-white]="activeCategory() === cat" [class.bg-white]="activeCategory() !== cat" [class.dark:bg-gray-800]="activeCategory() !== cat" [class.text-gray-700]="activeCategory() !== cat" [class.dark:text-gray-300]="activeCategory() !== cat" [attr.aria-pressed]="activeCategory() === cat">
              {{ cat }} ({{ countFor(cat) }})
            </button>
          }
        </div>

        <!-- Gallery grid with before/after sliders -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (item of filteredItems(); track item.id) {
            <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <app-before-after-slider
                [beforeSrc]="item.before.src"
                [afterSrc]="item.after.src"
                [beforeSrcsetWebp]="item.before.srcsetWebp"
                [beforeSrcsetJpg]="item.before.srcsetJpg"
                [afterSrcsetWebp]="item.after.srcsetWebp"
                [afterSrcsetJpg]="item.after.srcsetJpg"
                [beforeAlt]="item.before.alt"
                [afterAlt]="item.after.alt"
                [title]="item.title"
                height="240px"
              />
              <div class="p-4">
                <span class="inline-block bg-blue-100 dark:bg-blue-900/30 text-hydraulik-navy dark:text-blue-400 text-xs font-semibold px-2 py-1 rounded-full mb-2">{{ item.category }}</span>
                <h2 class="font-bold text-gray-900 dark:text-white">{{ item.title }}</h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">{{ item.description }}</p>
              </div>
            </div>
          }
        </div>

        @if (filteredItems().length === 0) {
          <div class="text-center py-16">
            <p class="text-gray-600 dark:text-gray-400 mt-4">Brak realizacji w tej kategorii</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class GalleryComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly categories = GALLERY_CATEGORIES;
  readonly items = GALLERY_ITEMS;
  readonly activeCategory = signal<GalleryCategory | null>(null);

  readonly filteredItems = computed(() => {
    const cat = this.activeCategory();
    return cat === null ? this.items : this.items.filter(i => i.category === cat);
  });

  ngOnInit(): void {
    this.seoService.setPage({
      title: 'Realizacje - Przed i Po',
      description: 'Galeria realizacji HydroFix: naprawy awarii, remonty łazienek, instalacje wodne i ogrzewanie. Przesuń suwak aby zobaczyć efekt przed i po.',
      url: '/galeria',
    });
  }

  setCategory(cat: GalleryCategory | null): void {
    this.activeCategory.set(cat);
  }

  countFor(cat: GalleryCategory): number {
    return this.items.filter(i => i.category === cat).length;
  }
}
