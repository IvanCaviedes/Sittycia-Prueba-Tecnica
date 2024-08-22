import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { of, switchMap } from 'rxjs';

import { AuthService } from '../auth.service';

export const noauthGuard: CanMatchFn = (route, segments) => {
  const _authService = inject(AuthService);

  return _authService.check().pipe(
    switchMap((authenticated) => {
      return of(!authenticated);
    })
  );
};
