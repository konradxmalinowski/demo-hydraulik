export interface Testimonial {
  name: string;
  city: string;
  rating: number;
  text: string;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marek W.',
    city: 'Kraków',
    rating: 5,
    text: 'Błyskawiczna reakcja na awarię - przyjechali w 35 minut. Rura pęknięta w nocy, a oni już o 23 byli na miejscu. Polecam z całego serca!',
    date: '2024-11-15',
  },
  {
    name: 'Anna K.',
    city: 'Kraków',
    rating: 5,
    text: 'Montaż łazienki od podstaw. Ekipa profesjonalna, czysto i punktualnie. Cena zgodna z wyceną. Zdecydowanie polecam.',
    date: '2024-10-28',
  },
  {
    name: 'Tomasz B.',
    city: 'Wieliczka',
    rating: 5,
    text: 'Usunęli zator w kanalizacji, który inni nie potrafili naprawić od 2 tygodni. Szybko, skutecznie i bez bałaganu.',
    date: '2024-09-12',
  },
  {
    name: 'Katarzyna N.',
    city: 'Nowa Huta',
    rating: 4,
    text: 'Wymiana instalacji wodnej w całym mieszkaniu. Dobra robota, terminowo. Drobne opóźnienie na początku, ale wynik świetny.',
    date: '2024-08-05',
  },
  {
    name: 'Piotr S.',
    city: 'Skawina',
    rating: 5,
    text: 'Montaż pompy ciepła i ogrzewania podłogowego. Wiedza na najwyższym poziomie. Oszczędzam teraz 40% na ogrzewaniu!',
    date: '2024-07-22',
  },
  {
    name: 'Ewa Z.',
    city: 'Kraków',
    rating: 5,
    text: 'Pilne zlecenie - zalanie przez sąsiada. Przyjechali w 28 minut i wszystko naprawili. Cena uczciwa jak zawsze.',
    date: '2024-06-18',
  },
  {
    name: 'Jakub R.',
    city: 'Niepołomice',
    rating: 5,
    text: 'Kilka wizyt w ciągu roku - za każdym razem pełen profesjonalizm. To już mój hydraulik na stałe.',
    date: '2024-05-30',
  },
  {
    name: 'Monika L.',
    city: 'Myślenice',
    rating: 4,
    text: 'Remont łazienki - kafelki, armatura, odpływy. Wszystko pięknie wykonane. Polecam za jakość i podejście do klienta.',
    date: '2024-04-15',
  },
];
