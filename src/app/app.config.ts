import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { demoModeInterceptor } from './core/interceptors/demo-mode.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // withIncrementalHydration() makes `@defer (hydrate on ...)` blocks render their
    // real content during SSR/prerender (crawlers and non-JS agents see it immediately)
    // while still deferring client-side hydration until the trigger fires.
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideHttpClient(withFetch(), withInterceptors([demoModeInterceptor])),
    provideAnimations(),
  ],
};
