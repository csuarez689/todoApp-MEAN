import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  returnUrl: string;
  error: string;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
    // redirect to home if already logged in
    if (this.authService.getToken()) {
      this.router.navigate(['/']);
    }
  }

  submit(): void {
    this.authService.login(this.form.value as User).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  register(): void {
    const dialogRef = this.dialog.open(RegisterFormComponent, {
      minWidth: '400px',
      maxWidth: '600px',
    });
  }

  loginWithFB(): void {}

  getEmailValidationError(): string {
    if (this.form.get('email').hasError('required')) {
      return 'El email es obligatorio';
    }
    if (this.form.get('email').hasError('pattern')) {
      return 'Email invalido';
    }
  }
  getPasswordValidationError(): string {
    if (this.form.get('password').hasError('required')) {
      return 'La contraseña es obligatoria';
    }
    if (this.form.get('password').hasError('minlength')) {
      return 'La contraseña debe contener al menos 6 caracteres';
    }
  }
}
