export type FaqCategory = 'Płatności' | 'Awarie' | 'Zakres Usług' | 'Gwarancja';

export interface FaqItem {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    category: 'Awarie',
    question: 'Jak szybko przyjedziecie w przypadku awarii?',
    answer: 'W przypadku pilnych awarii staramy się dotrzeć w ciągu 30-45 minut. Działamy 24/7, w tym weekendy i święta. Po przyjęciu zgłoszenia informujemy o dokładnym czasie przyjazdu.',
  },
  {
    id: 2,
    category: 'Awarie',
    question: 'Co robić gdy pęka rura i leje się woda?',
    answer: 'Natychmiast zakręć główny zawór odcinający wodę w mieszkaniu. Następnie zadzwoń do nas pod numer pogotowia hydraulicznego. Nasz dyspozytor udzieli Ci dalszych instrukcji i wyśle ekipę.',
  },
  {
    id: 3,
    category: 'Płatności',
    question: 'Jakie formy płatności akceptujecie?',
    answer: 'Akceptujemy gotówkę, przelew bankowy oraz karty płatnicze na miejscu. Faktury VAT wystawiamy na życzenie zarówno dla firm jak i osób prywatnych.',
  },
  {
    id: 4,
    category: 'Płatności',
    question: 'Czy wycena jest bezpłatna?',
    answer: 'Wycena przez telefon lub za pośrednictwem kalkulatora online jest zawsze bezpłatna. Dojazd do oceny zakresu prac wliczamy w koszt wykonania usługi — nie pobieramy opłat za same oględziny.',
  },
  {
    id: 5,
    category: 'Płatności',
    question: 'Czy ceny mogą się różnić od szacunku z kalkulatora?',
    answer: 'Kalkulator daje orientacyjne widełki cenowe. Ostateczna wycena jest ustalana po ocenie zakresu prac na miejscu. Jeśli koszt będzie wyższy niż przewidywany, zawsze informujemy przed przystąpieniem do pracy.',
  },
  {
    id: 6,
    category: 'Zakres Usług',
    question: 'Czy wykonujecie remonty łazienek?',
    answer: 'Tak, wykonujemy kompleksowe remonty łazienek — od projektu przez wyburzenie, ułożenie płytek, montaż armatury i instalacji, aż po wykończenie. Wszystko pod klucz.',
  },
  {
    id: 7,
    category: 'Zakres Usług',
    question: 'Czy montujecie pompy ciepła i ogrzewanie podłogowe?',
    answer: 'Tak, specjalizujemy się w nowoczesnych instalacjach grzewczych: pompach ciepła, ogrzewaniu podłogowym wodnym, kotłach kondensacyjnych i układach wielostrefowych.',
  },
  {
    id: 8,
    category: 'Zakres Usług',
    question: 'Na jakim obszarze działacie?',
    answer: 'Działamy na terenie Krakowa i okolic w promieniu 30 km: Wieliczka, Skawina, Myślenice, Niepołomice, Nowa Huta, Proszowice i okoliczne gminy.',
  },
  {
    id: 9,
    category: 'Gwarancja',
    question: 'Jaką gwarancję dajecie na wykonane prace?',
    answer: 'Na wszystkie wykonane prace udzielamy 24 miesiące gwarancji. Na materiały obowiązuje gwarancja producenta, zwykle 2-5 lat. Każda usługa jest dokumentowana i ubezpieczona.',
  },
  {
    id: 10,
    category: 'Gwarancja',
    question: 'Co obejmuje gwarancja na usługi hydrauliczne?',
    answer: 'Gwarancja obejmuje szczelność połączeń, prawidłowe działanie zamontowanych elementów i zgodność z normami. W przypadku reklamacji przyjeżdżamy bezpłatnie i usuwamy usterki.',
  },
];

export const FAQ_CATEGORIES: FaqCategory[] = ['Awarie', 'Płatności', 'Zakres Usług', 'Gwarancja'];
