import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [RouterOutlet],
  exportAs: 'EmptyComponent',
  templateUrl: './empty.component.html',
})
export class EmptyComponent {}
