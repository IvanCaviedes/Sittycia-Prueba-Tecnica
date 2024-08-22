import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [RouterOutlet],
  exportAs: 'PrincipalComponent',
  templateUrl: './principal.component.html',
})
export class PrincipalComponent {
  private _router = inject(Router);

  logout() {
    this._router.navigate(['/sign-out']);
  }
}
