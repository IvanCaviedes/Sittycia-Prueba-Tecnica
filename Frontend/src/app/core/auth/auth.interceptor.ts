import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';
import { environment } from '../../../environments/environment.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _authService = inject(AuthService);
  const baseUrl: string = environment.apiUrl;
  let newReq = req.clone({
    url: `${baseUrl}/${req.url}`,
  });

  if (_authService.accessToken) {
    newReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + _authService.accessToken
      ),
      url: `${baseUrl}/${req.url}`,
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
