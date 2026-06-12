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

const UNSPLASH_PARAMS = '?auto=format&fit=crop&w=1200&q=80';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    category: 'Awarie',
    title: 'Naprawa pękniętej rury',
    beforeSrc: `https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1${UNSPLASH_PARAMS}`,
    afterSrc: `https://images.unsplash.com/photo-1581094794329-c8112a89af12${UNSPLASH_PARAMS}`,
    beforeAlt: 'Pęknięta rura wodociągowa przed naprawą',
    afterAlt: 'Naprawiona rura wodociągowa',
    description: 'Błyskawiczna naprawa pękniętej rury w bloku mieszkalnym',
  },
  {
    id: 2,
    category: 'Łazienki',
    title: 'Remont łazienki — komplet',
    beforeSrc: `https://images.unsplash.com/photo-1552321554-5fefe8c9ef14${UNSPLASH_PARAMS}`,
    afterSrc: `https://images.unsplash.com/photo-1620626011761-996317b8d101${UNSPLASH_PARAMS}`,
    beforeAlt: 'Stara łazienka przed remontem',
    afterAlt: 'Nowa łazienka po remoncie',
    description: 'Kompleksowy remont łazienki: kafelki, armatura, odpływy, oświetlenie',
  },
  {
    id: 3,
    category: 'Instalacje',
    title: 'Wymiana instalacji wodnej',
    beforeSrc: `https://images.unsplash.com/photo-1585704032915-c3400ca199e7${UNSPLASH_PARAMS}`,
    afterSrc: `https://images.unsplash.com/photo-1581092160562-40aa08e78837${UNSPLASH_PARAMS}`,
    beforeAlt: 'Stara instalacja wodna',
    afterAlt: 'Nowa instalacja wodna z PEX',
    description: 'Wymiana całej instalacji wodnej na system PEX w 3-pokojowym mieszkaniu',
  },
  {
    id: 4,
    category: 'Ogrzewanie',
    title: 'Montaż ogrzewania podłogowego',
    beforeSrc: `https://images.unsplash.com/photo-1604709177225-055f99402ea3${UNSPLASH_PARAMS}`,
    afterSrc: `https://images.unsplash.com/photo-1571902943202-507ec2618e8f${UNSPLASH_PARAMS}`,
    beforeAlt: 'Podłoga przed montażem ogrzewania',
    afterAlt: 'Gotowa instalacja ogrzewania podłogowego',
    description: 'Montaż ogrzewania podłogowego wodnego na powierzchni 80m²',
  },
  {
    id: 5,
    category: 'Awarie',
    title: 'Udrożnienie kanalizacji',
    beforeSrc: `https://images.unsplash.com/photo-1607472586893-edb57bdc0e39${UNSPLASH_PARAMS}`,
    afterSrc: `https://images.unsplash.com/photo-1556911220-bff31c812dba${UNSPLASH_PARAMS}`,
    beforeAlt: 'Zatkana kanalizacja',
    afterAlt: 'Drożna kanalizacja po udrożnieniu',
    description: 'Usunięcie uciążliwego zatoru metodą ciśnieniową',
  },
  {
    id: 6,
    category: 'Łazienki',
    title: 'Prysznic walk-in',
    beforeSrc: `https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3${UNSPLASH_PARAMS}`,
    afterSrc: `https://images.unsplash.com/photo-1600566752355-35792bedcfea${UNSPLASH_PARAMS}`,
    beforeAlt: 'Stary prysznic z brodzikiem',
    afterAlt: 'Nowoczesny prysznic walk-in',
    description: 'Zamiana prysznica z brodzikiem na nowoczesny walk-in z odpływem liniowym',
  },
];

export const GALLERY_CATEGORIES: GalleryCategory[] = ['Awarie', 'Łazienki', 'Instalacje', 'Ogrzewanie'];
