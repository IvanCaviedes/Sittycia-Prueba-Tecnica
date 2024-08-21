import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowUpRight,
  heroEye,
  heroEyeSlash,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [NgIconComponent, RouterLink],
  providers: [provideIcons({ heroEyeSlash, heroEye, heroArrowUpRight })],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  showPassword = false;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
