export type GalleryCategory = 'Awarie' | 'Łazienki' | 'Instalacje' | 'Ogrzewanie';

export interface GalleryImage {
  /** Fallback <img src> - a single JPEG, used by browsers that ignore srcset/picture. */
  src: string;
  /** WebP responsive sources, e.g. "assets/gallery/1-before-480.webp 480w, ...". */
  srcsetWebp: string;
  /** JPEG responsive sources for browsers without WebP support. */
  srcsetJpg: string;
  alt: string;
}

export interface GalleryItem {
  id: number;
  category: GalleryCategory;
  title: string;
  before: GalleryImage;
  after: GalleryImage;
  description: string;
}

/** Self-hosted, pre-optimized (WebP + JPEG fallback, 480/800/1200w) replacements for the former Unsplash hotlinks. */
const GALLERY_BASE = 'assets/gallery';
const WIDTHS = [480, 800, 1200] as const;

function image(name: string, alt: string): GalleryImage {
  const srcsetWebp = WIDTHS.map(w => `${GALLERY_BASE}/${name}-${w}.webp ${w}w`).join(', ');
  const srcsetJpg = `${GALLERY_BASE}/${name}-800.jpg 800w`;
  return {
    src: `${GALLERY_BASE}/${name}-800.jpg`,
    srcsetWebp,
    srcsetJpg,
    alt,
  };
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    category: 'Awarie',
    title: 'Naprawa pękniętej rury',
    before: image('1-before', 'Pęknięta rura wodociągowa przed naprawą'),
    after: image('1-after', 'Naprawiona rura wodociągowa'),
    description: 'Błyskawiczna naprawa pękniętej rury w bloku mieszkalnym',
  },
  {
    id: 2,
    category: 'Łazienki',
    title: 'Remont łazienki - komplet',
    before: image('2-before', 'Stara łazienka przed remontem'),
    after: image('2-after', 'Nowa łazienka po remoncie'),
    description: 'Kompleksowy remont łazienki: kafelki, armatura, odpływy, oświetlenie',
  },
  {
    id: 3,
    category: 'Instalacje',
    title: 'Wymiana instalacji wodnej',
    before: image('3-before', 'Stara instalacja wodna'),
    after: image('3-after', 'Nowa instalacja wodna z PEX'),
    description: 'Wymiana całej instalacji wodnej na system PEX w 3-pokojowym mieszkaniu',
  },
  {
    id: 4,
    category: 'Ogrzewanie',
    title: 'Montaż ogrzewania podłogowego',
    before: image('4-before', 'Podłoga przed montażem ogrzewania'),
    after: image('4-after', 'Gotowa instalacja ogrzewania podłogowego'),
    description: 'Montaż ogrzewania podłogowego wodnego na powierzchni 80m²',
  },
  {
    id: 5,
    category: 'Awarie',
    title: 'Udrożnienie kanalizacji',
    before: image('5-before', 'Zatkana kanalizacja'),
    after: image('5-after', 'Drożna kanalizacja po udrożnieniu'),
    description: 'Usunięcie uciążliwego zatoru metodą ciśnieniową',
  },
  {
    id: 6,
    category: 'Łazienki',
    title: 'Prysznic walk-in',
    before: image('6-before', 'Stary prysznic z brodzikiem'),
    after: image('6-after', 'Nowoczesny prysznic walk-in'),
    description: 'Zamiana prysznica z brodzikiem na nowoczesny walk-in z odpływem liniowym',
  },
];

export const GALLERY_CATEGORIES: GalleryCategory[] = ['Awarie', 'Łazienki', 'Instalacje', 'Ogrzewanie'];
