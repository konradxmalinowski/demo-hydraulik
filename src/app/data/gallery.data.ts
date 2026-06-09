export type GalleryCategory = 'Awarie' | 'Łazienki' | 'Instalacje' | 'Ogrzewanie';

export interface GalleryItem {
  id: number;
  category: GalleryCategory;
  title: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  description: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    category: 'Awarie',
    title: 'Naprawa pękniętej rury',
    beforeSrc: 'assets/images/gallery/awaria-rura-before.webp',
    afterSrc: 'assets/images/gallery/awaria-rura-after.webp',
    beforeAlt: 'Pęknięta rura wodociągowa przed naprawą',
    afterAlt: 'Naprawiona rura wodociągowa',
    description: 'Błyskawiczna naprawa pękniętej rury w bloku mieszkalnym',
  },
  {
    id: 2,
    category: 'Łazienki',
    title: 'Remont łazienki — komplet',
    beforeSrc: 'assets/images/gallery/lazienka-before.webp',
    afterSrc: 'assets/images/gallery/lazienka-after.webp',
    beforeAlt: 'Stara łazienka przed remontem',
    afterAlt: 'Nowa łazienka po remoncie',
    description: 'Kompleksowy remont łazienki: kafelki, armatura, odpływy, oświetlenie',
  },
  {
    id: 3,
    category: 'Instalacje',
    title: 'Wymiana instalacji wodnej',
    beforeSrc: 'assets/images/gallery/instalacja-before.webp',
    afterSrc: 'assets/images/gallery/instalacja-after.webp',
    beforeAlt: 'Stara instalacja wodna',
    afterAlt: 'Nowa instalacja wodna z PEX',
    description: 'Wymiana całej instalacji wodnej na system PEX w 3-pokojowym mieszkaniu',
  },
  {
    id: 4,
    category: 'Ogrzewanie',
    title: 'Montaż ogrzewania podłogowego',
    beforeSrc: 'assets/images/gallery/ogrzewanie-before.webp',
    afterSrc: 'assets/images/gallery/ogrzewanie-after.webp',
    beforeAlt: 'Podłoga przed montażem ogrzewania',
    afterAlt: 'Gotowa instalacja ogrzewania podłogowego',
    description: 'Montaż ogrzewania podłogowego wodnego na powierzchni 80m²',
  },
  {
    id: 5,
    category: 'Awarie',
    title: 'Udrożnienie kanalizacji',
    beforeSrc: 'assets/images/gallery/kanalizacja-before.webp',
    afterSrc: 'assets/images/gallery/kanalizacja-after.webp',
    beforeAlt: 'Zatkana kanalizacja',
    afterAlt: 'Drożna kanalizacja po udrożnieniu',
    description: 'Usunięcie uciążliwego zatoru metodą ciśnieniową',
  },
  {
    id: 6,
    category: 'Łazienki',
    title: 'Prysznic walk-in',
    beforeSrc: 'assets/images/gallery/prysznic-before.webp',
    afterSrc: 'assets/images/gallery/prysznic-after.webp',
    beforeAlt: 'Stary prysznic z brodzikiem',
    afterAlt: 'Nowoczesny prysznic walk-in',
    description: 'Zamiana prysznica z brodzikiem na nowoczesny walk-in z odpływem liniowym',
  },
];

export const GALLERY_CATEGORIES: GalleryCategory[] = ['Awarie', 'Łazienki', 'Instalacje', 'Ogrzewanie'];
