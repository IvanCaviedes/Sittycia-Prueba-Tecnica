import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sign-out.component.html',
})
export class SignOutComponent {
  countdown: number = 5;
  countdownMapping: any = {
    '=1': '# second',
    other: '# seconds',
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _authService: AuthService) {}

  private _router = inject(Router);

  ngOnInit(): void {
    this._authService.signOut();

    timer(1000, 1000)
      .pipe(
        finalize(() => {
          this._router.navigate(['/sign-in']);
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
