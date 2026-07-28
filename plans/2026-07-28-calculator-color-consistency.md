# Spójność kolorów - Kalkulator Wyceny (demo-hydraulik)

## Problem

`src/app/features/calculator/calculator.component.ts` używa surowych klas Tailwind
(`bg-blue-50`, `text-blue-500`, `accent-blue-500`, `ring-blue-500`, `text-blue-700`,
`bg-blue-500`) wymieszanych z osobnym, niezwiązanym z resztą palety `text-green-700
dark:text-green-400` dla wyniku ceny. Reszta aplikacji ma już zdefiniowaną spójną paletę marki w
`tailwind.config.js` (`hydraulik-navy`, `hydraulik-steel`, `hydraulik-orange` - ten ostatni
świadomie zarezerwowany dla przycisku awaryjnego, patrz komentarz `KEEP - emergency button
(REQ-41)`, nie ruszać). Efekt: kalkulator wygląda jak inny produkt niż reszta strony - przypadkowe
niebieskie i zielone akcenty bez powiązania z marką.

## Kryteria akceptacji

- Wszystkie miejsca w `calculator.component.ts` używające `blue-*` zamienione na `hydraulik-steel`
  lub `hydraulik-navy` (w zależności od kontekstu - `steel` dla interaktywnych akcentów typu
  focus ring/slider/wybór opcji, `navy` dla tekstu/liczb podkreślających wynik).
- Zielony akcent przy cenie (`text-green-700 dark:text-green-400`) zamieniony na spójny z resztą
  token marki (`hydraulik-navy` lub `hydraulik-steel`) - bez wprowadzania nowego koloru.
- `hydraulik-orange` (przycisk awaryjny) pozostaje nietknięty.
- Brak regresji trybu ciemnego - kontrast WCAG AA zachowany dla zmienionych elementów.

## Zakres i skala

Jedna aplikacja, jeden agent (frontend-agent), jeden plik. Część szerszego zadania spójności
brandingu dla 4 niezależnych demo (fryzjer, hydraulik, restauracja, mechanik) - każde osobne repo
git, agent działa równolegle względem pozostałych trzech, rozłączne zbiory plików.

Uwaga: naprawa motywu jasny/ciemny (device-based dark mode) zgłoszona przez użytkownika NIE dotyczy
tego demo w tej turze - użytkownik potwierdził zawężenie tylko do demo-fryzjer. `src/index.html`
(matchMedia fallback) pozostaje bez zmian.

## Warstwy dotknięte

Wyłącznie frontend (Angular + Tailwind). Brak zmian backend/DB/auth/API.

## Plik do zmiany (owned by frontend-agent)

- `src/app/features/calculator/calculator.component.ts` (linie ok. 61, 93, 95, 132, 139, 166, 174,
  181) - zamiana klas kolorów jak opisano wyżej.

## Edge case'y

- Sprawdzić stan `:disabled`/hover/focus przycisków i inputów po zmianie kolorów - focus ring musi
  pozostać wyraźnie widoczny (dostępność, klawiatura).
- Upewnić się, że `hydraulik-steel` (#3B82F6 - ta sama wartość co obecny `blue-500`) daje identyczny
  efekt wizualny tam, gdzie to pożądane, więc zmiana jest głównie semantyczna (nazwa tokenu), a nie
  wizualna - z wyjątkiem zielonego akcentu przy cenie, który faktycznie zmienia kolor.
