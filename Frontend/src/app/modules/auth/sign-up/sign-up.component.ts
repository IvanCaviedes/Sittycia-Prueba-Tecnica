import { Component, inject, ViewChild } from '@angular/core';
import {
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowUpRight,
  heroEye,
  heroEyeSlash,
} from '@ng-icons/heroicons/outline';

import { AlertComponent } from '../../../components/alert/alert.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [NgIconComponent, RouterLink, ReactiveFormsModule, AlertComponent],
  providers: [provideIcons({ heroEyeSlash, heroEye, heroArrowUpRight })],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  @ViewChild('signUpNgForm') signUpNgForm!: NgForm;
  @ViewChild('alertComponent') alertComponent!: AlertComponent;

  showPassword = false;
  signUpForm!: UntypedFormGroup;
  private route = inject(ActivatedRoute);
  private _router = inject(Router);
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this._formBuilder.group({
      Username: ['nuevo', Validators.required],
      Password: ['nuevo123', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signUp(): void {
    if (this.signUpForm.invalid) {
      return;
    }
    this.signUpForm.disable();
    this._authService.signUp(this.signUpForm.value).subscribe(
      (response) => {
        this._router.navigate(['/dashboard/task']);
      },
      (response) => {
        // Re-enable the form
        this.signUpForm.enable();

        // Reset the form
        this.signUpNgForm.resetForm();

        this.alertComponent.showAlert(
          'A ocurrido un error intente mas tarde',
          'error'
        );
      }
    );
  }
}
