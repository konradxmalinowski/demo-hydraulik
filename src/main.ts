import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

if ('serviceWorker' in navigator && !isDevMode()) {
  window.addEventListener('load', () => {
    // relative path resolves against <base href>, keeping the GitHub Pages subpath scope
    navigator.serviceWorker.register('sw.js');
  });
}
