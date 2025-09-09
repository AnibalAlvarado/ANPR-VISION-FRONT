import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpErrorResponse,HttpParams  } from '@angular/common/http';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: { userId: number; token: string; roles: string[] };
  errors?: string[];
}

type ErrorLike = { error?: { message?: string }; message?: string };


function usernameExistsValidator(service: General, getCurrentId: () => number | null): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const value = (control.value ?? '').trim();
    if (!value) return of<ValidationErrors | null>(null);

    const id = getCurrentId();
    let params = new HttpParams()
      .set('field', 'UserName')
      .set('value', value);
    if (id != null) params = params.set('currentId', String(id));

    return of(value).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() =>
        service.get<{ data: { exists: boolean } }>('User/check', params)
      ),
      map(resp => (resp?.data?.exists ? { usernameTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}

function emailExistsValidator(service: General, getCurrentId: () => number | null): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const value = (control.value ?? '').trim();
    if (!value) return of<ValidationErrors | null>(null);

    const id = getCurrentId();
    let params = new HttpParams()
      .set('field', 'Email')
      .set('value', value);
    if (id != null) params = params.set('currentId', String(id));

    return of(value).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() =>
        service.get<{ data: { exists: boolean } }>('User/check', params)
      ),
      map(resp => (resp?.data?.exists ? { emailTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  get userId(): number | null {
    const raw = localStorage.getItem('userId');
    return raw ? Number(JSON.parse(raw)) : null;
  }

  LoginDto = { username: '', password: '' };

  showPassword = true;

  form = inject(FormBuilder).group({
    id: [null],
    userName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      [usernameExistsValidator(inject(General), () => this.userId)]
    ],
    email: [
      '',
      [Validators.required, Validators.email],
      [emailExistsValidator(inject(General), () => this.userId)]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]
    ],
    personId: ['', Validators.required],
    asset: [true]
  });

  private service = inject(General);
  private router = inject(Router);

  constructor() {}

  private controlMsg(ctrl: AbstractControl | null, name: string): string | null {
    if (!ctrl) return null;
    if (ctrl.hasError('required')) return `${name} es obligatorio`;
    if (ctrl.hasError('minlength')) return `${name} es muy corto`;
    if (ctrl.hasError('maxlength')) return `${name} es muy largo`;
    if (ctrl.hasError('email')) return `Formato de correo inválido`;
    if (ctrl.hasError('usernameTaken')) return `El usuario ya está registrado`;
    if (ctrl.hasError('emailTaken')) return `El correo ya está registrado`;
    if (ctrl.hasError('pattern') && name === 'Contraseña') {
      return 'Debe tener al menos 1 mayúscula, 1 número y 1 carácter especial';
    }
    return null;
  }

  get fUser() { return this.form.get('userName'); }
  get fEmail() { return this.form.get('email'); }
  get fPass() { return this.form.get('password'); }
  get fPerson() { return this.form.get('personId'); }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const msgUser = this.controlMsg(this.fUser, 'Usuario');
      const msgEmail = this.controlMsg(this.fEmail, 'Email');
      const msgPass = this.controlMsg(this.fPass, 'Contraseña');

      const errores = [msgUser, msgEmail, msgPass].filter(Boolean).join('. ');
      Swal.fire({ icon: 'warning', title: 'Campos inválidos', text: errores || 'Revisa el formulario.' });
      return;
    }

    const { userName, password } = this.form.getRawValue();

    this.service.post<LoginResponse>('User/login', { username: userName, password }).subscribe({
      next: (response) => {
        if (response.success && response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userRoles', JSON.stringify(response.data.roles));
          localStorage.setItem('username', userName || '');
          localStorage.setItem('userId', JSON.stringify(response.data.userId));

          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: response.message || 'Has iniciado sesión correctamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => this.router.navigate(['/analytics']));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: response.message || 'Credenciales incorrectas.'
          });
        }
      },
      error: (e: unknown) => {
        console.error('Error en login:', e);
        let msg = 'Error desconocido. Intenta más tarde.';
        if (e instanceof HttpErrorResponse) {
          msg = e.error?.message || e.message || msg;
        } else if (typeof e === 'object' && e !== null) {
          const maybe = e as ErrorLike;
          msg = maybe.error?.message || maybe.message || msg;
        }
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      }
    });
  }

  restablecerContrasena() { this.router.navigate(['/reset-password']); }
}
