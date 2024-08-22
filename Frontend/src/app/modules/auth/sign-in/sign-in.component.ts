import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, UrlTree } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowUpRight,
  heroEye,
  heroEyeSlash,
} from '@ng-icons/heroicons/outline';

import { AlertComponent } from '../../../components/alert/alert.component';
import { AuthService } from '../../../core/auth/auth.service';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [NgIconComponent, RouterLink, ReactiveFormsModule, AlertComponent],
  providers: [provideIcons({ heroEyeSlash, heroEye, heroArrowUpRight })],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm!: NgForm;
  @ViewChild('alertComponent') alertComponent!: AlertComponent;

  showPassword = false;
  signInForm!: UntypedFormGroup;
  private route = inject(ActivatedRoute);

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      username: ['ivancaviedes1', [Validators.required]],
      password: ['NuevaContraseña', Validators.required],
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
    this._authService.signIn(this.signInForm.value).subscribe(
      () => {
        const redirectURL = this.route.snapshot.queryParamMap.get(
          'redirectURL'
        ) as string | UrlTree;

        this._router.navigateByUrl(redirectURL);
      },
      (response) => {
        console.log(response);

        this.signInForm.enable();
        this.signInNgForm.resetForm();
        this.alertComponent.showAlert(
          'Usuario o Contraseña equivocada',
          'error'
        );
      }
    );
  }
}
