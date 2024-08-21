import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowUpRight,
  heroEye,
  heroEyeSlash,
} from '@ng-icons/heroicons/outline';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [NgIconComponent, RouterLink, ReactiveFormsModule],
  providers: [provideIcons({ heroEyeSlash, heroEye, heroArrowUpRight })],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  showPassword = false;
  signInForm!: UntypedFormGroup;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      username: ['userName', [Validators.required]],
      password: ['admin', Validators.required],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signIn(): void {
    if (this.signInForm.invalid) {
      return;
    }
    this.signInForm.disable();
    this._authService.signIn(this.signInForm.value);
  }
}
