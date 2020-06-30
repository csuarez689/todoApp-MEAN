import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<RegisterFormComponent>,
    private router: Router
  ) {
    dialogRef.disableClose = true;

    this.form = this.fb.group({
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.{2,30}$)[A-ZÁÉÍÓÚ][a-zñáéíóú]+(?: [A-ZÁÉÍÓÚ][a-zñáéíóú]+)?$'
          ),
        ]),
      ],
      apellido: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.{2,30}$)[A-ZÁÉÍÓÚ][a-zñáéíóú]+(?: [A-ZÁÉÍÓÚ][a-zñáéíóú]+)?$'
          ),
        ]),
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
      ],
      emailConfirmation: [
        '',
        Validators.compose([Validators.required, this.mustMatchEmail]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      passwordConfirmation: [
        '',
        Validators.compose([Validators.required, this.mustMatchPassword]),
      ],
    });
  }

  signUp(): void {
    this.authService.register(this.form.value as User).subscribe((user) => {
      if (user) this.router.navigate(['/']);
      this.close();
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  //Errores de validacion
  mustMatchEmail(control: FormControl) {
    if (control.parent) {
      let compare = (control.value || '') == control.parent.value.email;
      return compare ? null : { mustMatch: true };
    }
    return null;
  }
  mustMatchPassword(control: FormControl) {
    if (control.parent) {
      let compare = (control.value || '') == control.parent.value.password;
      return compare ? null : { mustMatch: true };
    }
    return null;
  }

  getNombreValidationError(): string {
    if (this.form.get('nombre').hasError('required')) {
      return 'El nombre es obligatorio';
    }
    if (this.form.get('nombre').hasError('pattern')) {
      return 'Ingrese un nombre valido';
    }
  }

  getApellidoValidationError(): string {
    if (this.form.get('apellido').hasError('required')) {
      return 'El apellido es obligatorio';
    }
    if (this.form.get('apellido').hasError('pattern')) {
      return 'Ingrese un apellido valido';
    }
  }

  getEmailValidationError(): string {
    if (this.form.get('email').hasError('required')) {
      return 'El email es obligatorio';
    }
    if (this.form.get('email').hasError('pattern')) {
      return 'Email invalido';
    }
  }

  getEmailConfirmationValidationError(): string {
    if (this.form.get('emailConfirmation').hasError('required')) {
      return 'Debe confirmar su correo';
    }
    if (this.form.get('emailConfirmation').hasError('mustMatch')) {
      return 'Los correos deben coincidir';
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
  getPasswordConfirmationValidationError(): string {
    if (this.form.get('passwordConfirmation').hasError('required')) {
      return 'Debe confirmar su contraseña';
    }
    if (this.form.get('passwordConfirmation').hasError('mustMatch')) {
      return 'Las contraseñas deben coincidir';
    }
  }
}
