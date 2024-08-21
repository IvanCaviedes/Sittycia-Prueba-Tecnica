import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';
import { AuthUtils } from './auth.utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _authService = inject(AuthService);
  let newReq = req.clone();

  if (
    _authService.accessToken &&
    !AuthUtils.isTokenExpired(_authService.accessToken)
  ) {
    newReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + _authService.accessToken
      ),
    });
  }

  return next(newReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        _authService.signOut();
        location.reload();
      }
      return throwError(error);
    })
  );
};
