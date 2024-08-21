import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../auth.service';
import { of, switchMap } from 'rxjs';

export const noauthGuard: CanMatchFn = (route, segments) => {
  const _authService = inject(AuthService);

  return _authService.check().pipe(
    switchMap((authenticated) => {
      return of(!authenticated);
    })
  );
};
