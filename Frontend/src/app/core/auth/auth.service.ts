import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';

import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authenticated: boolean = false;

  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) {}

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  signOut(): Observable<any> {
    localStorage.removeItem('accessToken');
    this._authenticated = false;
    return of(true);
  }
  signIn(credentials: { username: string; password: string }) {
    return this._httpClient.post('Auth/login', credentials).pipe(
      switchMap((response: any) => {
        this.accessToken = response.token;
        this._authenticated = true;
        return of(response);
      })
    );
  }

  signUp(user: { Username: string; Password: string }) {
    return this._httpClient.post('Auth/register', user);
  }

  signInUsingToken(): Observable<any> {
    return this._httpClient.get('Auth/Me').pipe(
      catchError(() => {
        this._authenticated = true;
        return of(false);
      }),
      switchMap((response: any) => {
        if (response.token) {
          this.accessToken = response.token;
        }
        this._authenticated = true;
        return of(true);
      })
    );
  }

  check(): Observable<boolean> {
    if (this._authenticated) {
      return of(true);
    }
    if (!this.accessToken) {
      return of(false);
    }

    return this.signInUsingToken();
  }
}
