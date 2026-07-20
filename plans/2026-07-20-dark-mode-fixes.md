# Naprawa motywu jasnego - demo-hydraulik (kalkulator wyceny)

## Problem

Zgloszenie: problem z motywem, glownie w kalkulatorze i wycenie, dla motywu JASNEGO. Diagnoza
(Explore agent, 2026-07-20): mechanizm przelaczania dziala poprawnie (logika w
`navbar.component.ts` linie 174-222, klasa `dark` na `document.documentElement`, Tailwind
`darkMode: 'class'`). Problem jest odwrotny do typowego - czesc klas w
`src/app/features/calculator/calculator.component.ts` nie ma wariantu `dark:` i wyglada dobrze
tylko w trybie ciemnym, a w jasnym ma zbyt niski kontrast lub bledny wyglad:

1. Linia 55 - `border-gray-200` bez `dark:` - niemal niewidoczna ramka na bialej karcie w jasnym
   trybie.
2. Linia 90 - `text-gray-400` (etykiety "1h/4h/8h") bez `dark:` - niski kontrast na bialym tle.
3. Linie 153, 174 - panel LCD z wycena ma zahardkodowane `bg-gray-900`/`bg-gray-800` BEZ warunku
   `dark:` - zawsze ciemny prostokat, rowniez w trybie jasnym, gdzie wyglada jak blad wizualny na tle
   `bg-gray-50`/`bg-white`.
4. Linie 65, 99 - `text-gray-500` sublabel, mniejszy priorytet (kontrast na granicy akceptowalnosci).

## Kryteria akceptacji

- W trybie jasnym: ramki przyciskow typu uslugi widoczne, etykiety godzin czytelne, panel LCD z
  wycena wizualnie spojny z reszta jasnego UI (nie ciemny prostokat).
- W trybie ciemnym: bez regresji - obecny wyglad ma pozostac.
- Panel LCD moze zachowac odrebny "cyfrowy" styl (czarne tlo z zielonym/bursztynowym tekstem to
  celowy motyw LCD), ale musi miec jawny wariant jasny zamiast bycia zahardkodowanym.

## Zakres i skala

Jedna aplikacja, jeden agent (frontend-agent), jeden plik glowny (`calculator.component.ts`).
Rownolegle z pozostalymi 3 projektami (osobne repo git, brak konfliktu plikow).

## Warstwy dotkniete

Wylacznie frontend (Angular + Tailwind CSS). Brak zmian backend/DB/auth.

## Pliki do naprawy (owned by frontend-agent)

- `src/app/features/calculator/calculator.component.ts` (linie 55, 65, 90, 99, 153, 174)

## Strategia naprawy

Dodac brakujace warianty `dark:` tam gdzie klasa byla napisana tylko pod jeden motyw (np.
`border-gray-200` -> dodac `dark:border-gray-700` jesli taki byl niejawnie zakladany, lub odwrotnie
dopisac jawny jasny wariant przy klasach zahardkodowanych jak `bg-gray-900` -> uczynic je
`dark:bg-gray-900 bg-gray-50` lub odpowiednik zgodny z reszta palety kalkulatora). Zdecydowac o
dokladnych wartosciach kolorow na podstawie istniejacej palety uzywanej w innych miejscach tego
komponentu i reszty aplikacji (np. `navbar.component.ts` jako wzor spojnosci).

## Edge cases

- Kalkulator z juz wprowadzonymi wartosciami (godziny, typ uslugi) przy przelaczeniu motywu - stan
  formularza bez zmian, tylko warstwa wizualna.
- Panel LCD przy wartosci 0 / pustej wycenie - sprawdzic czy kontrast tekstu nadal czytelny w obu
  trybach.

## Delegacja

frontend-agent - pelny zakres pliku wyzej, rownolegle z frontend-agent dla demo-fryzjer,
demo-restauracja, demo-mechanik.
