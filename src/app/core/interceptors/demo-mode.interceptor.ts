import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY } from 'rxjs';
import { DemoModeService } from '../services/demo-mode.service';

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export const demoModeInterceptor: HttpInterceptorFn = (req, next) => {
  if (MUTATION_METHODS.includes(req.method)) {
    const demoModeService = inject(DemoModeService);
    demoModeService.open();
    return EMPTY;
  }
  return next(req);
};
