import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'HydroFix 24/7 — Hydraulik Kraków',
  },
  {
    path: 'kalkulator',
    loadComponent: () =>
      import('./features/calculator/calculator.component').then(m => m.CalculatorComponent),
    title: 'Kalkulator Wyceny — HydroFix',
  },
  {
    path: 'galeria',
    loadComponent: () =>
      import('./features/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Realizacje — HydroFix',
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./features/faq/faq.component').then(m => m.FaqComponent),
    title: 'Często Zadawane Pytania — HydroFix',
  },
  {
    path: 'kontakt',
    loadComponent: () =>
      import('./features/contact/contact.component').then(m => m.ContactComponent),
    title: 'Kontakt — HydroFix',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
