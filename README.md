# Demo: Hydraulik

Działające demo strony dla hydraulika / pogotowia hydraulicznego — zbudowane w Angular + TypeScript z Angular Signals i SSR.

Część portfolio [Konrad Malinowski](https://malinowski.dev) — pokazuje, jak może wyglądać strona Twojej firmy.

**Live demo:** https://konradxmalinowski.github.io/demo-hydraulik/

---

## Co pokazuje to demo

- Przycisk awarii z animacją pulsu — numer telefonu widoczny natychmiast
- Kalkulator wyceny usługi krok po kroku
- Galeria realizacji z suwakiem before/after
- Mapa obszaru działania
- Tryb 24/7 — pełne pogotowie hydrauliczne
- Core Web Vitals zoptymalizowane (SSR + lazy loading)

## Stack

- **Angular 19** + TypeScript
- **Angular Signals** — reaktywny stan bez BehaviorSubject
- **SSR (Server-Side Rendering)** — lepsza indeksacja i LCP
- **Tailwind CSS** — stylowanie
- **Angular CLI** — build i serwowanie

## Uruchomienie lokalne

```bash
npm install
ng serve
```

Aplikacja będzie dostępna pod http://localhost:4200

## Budowanie produkcyjne

```bash
ng build
```

Pliki wyjściowe znajdą się w katalogu `dist/`.

## Struktura

```
src/
├── app/
│   ├── components/     # Komponenty UI
│   ├── pages/          # Widoki (Home, Services, Gallery, Contact)
│   └── services/       # Logika kalkulatora i obszaru działania
└── assets/
```

## Zainteresowany podobną stroną?

Napisz: [malinowski.konrad45@gmail.com](mailto:malinowski.konrad45@gmail.com)  
Portfolio: [malinowski.dev](https://malinowski.dev)
