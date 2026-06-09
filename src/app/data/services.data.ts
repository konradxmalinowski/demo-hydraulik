export interface HydraulikService {
  id: string;
  name: string;
  icon: string;
  description: string;
  slug: string;
}

export const HYDRAULIK_SERVICES: HydraulikService[] = [
  {
    id: 'awaria',
    name: 'Usuwanie awarii',
    icon: '',
    description: 'Szybka reakcja na nagłe awarie hydrauliczne. Przyjedziemy w ciągu 30-45 minut i naprawimy problem.',
    slug: 'usuwanie-awarii',
  },
  {
    id: 'armatura',
    name: 'Montaż armatury',
    icon: '',
    description: 'Profesjonalny montaż kranów, baterii, pryszniców i innej armatury łazienkowej i kuchennej.',
    slug: 'montaz-armatury',
  },
  {
    id: 'instalacje-wodne',
    name: 'Instalacje wodne',
    icon: '',
    description: 'Kompleksowe instalacje wodociągowe, remonty i modernizacja istniejących systemów.',
    slug: 'instalacje-wodne',
  },
  {
    id: 'instalacje-kanalizacyjne',
    name: 'Instalacje kanalizacyjne',
    icon: '',
    description: 'Drożenie i naprawy kanalizacji, montaż odpływów, usuwanie zatorów.',
    slug: 'instalacje-kanalizacyjne',
  },
  {
    id: 'ogrzewanie',
    name: 'Ogrzewanie',
    icon: '',
    description: 'Montaż i serwis instalacji grzewczych, kotłów, grzejników i systemów podłogowych.',
    slug: 'ogrzewanie',
  },
  {
    id: 'pogotowie',
    name: 'Pogotowie hydrauliczne',
    icon: '',
    description: 'Całodobowe pogotowie hydrauliczne 24/7. Awarie, pęknięte rury, zalania — działamy natychmiast.',
    slug: 'pogotowie-hydrauliczne',
  },
];
