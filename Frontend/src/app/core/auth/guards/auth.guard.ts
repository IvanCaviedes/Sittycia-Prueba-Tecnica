import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

export const authGuard: CanMatchFn = (route, segments) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);

  function _check(segments: UrlSegment[]): Observable<boolean | UrlTree> {
    return _authService.check().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          const redirectURL = `/${segments.join('/')}`;
          const urlTree = _router.parseUrl(
            `sign-in?redirectURL=${redirectURL}`
          );

          return of(urlTree);
        }
        return of(true);
      })
    );
  }

  return _check(segments);
};
