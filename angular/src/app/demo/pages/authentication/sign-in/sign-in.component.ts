/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { General } from 'src/app/generic/general.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

interface AuthData {
  userId: number;
  token: string;
  roles: string[];
  // agrega otros campos si tu back los envía en data
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  details?: any;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule,MatProgressSpinnerModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  LoginDto = {
    username: '',
    password: ''
  };

  showPassword = false;
  loading = false;

  private service = inject(General);
  private router = inject(Router);

  constructor() {}

  private unwrapData(resp: AuthData | ApiResponse<AuthData>): AuthData | null {
    // Soporta back con wrapper { success, data } o directo
    const isWrapped = (resp as ApiResponse<AuthData>)?.data !== undefined;
    if (isWrapped) {
      const w = resp as ApiResponse<AuthData>;
      if (!w.success) {
        // General ya puede lanzar error, pero por si llega acá:
        throw new Error(w.message || 'Error en autenticación.');
      }
      return w.data ?? null;
    }
    return resp as AuthData;
  }

  login() {
    if (!this.LoginDto.username || !this.LoginDto.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingresa tu usuario y contraseña.'
      });
      return;
    }

    this.loading = true;

    // Pedimos AuthData o ApiResponse<AuthData> y lo des-empacamos
    this.service.post<AuthData | ApiResponse<AuthData>>('User/login', this.LoginDto).subscribe({
      next: (resp) => {
        let data: AuthData | null = null;
        try {
          data = this.unwrapData(resp);
        } catch (e: any) {
          throw new Error(e?.message || 'Error de autenticación.');
        }

        if (!data?.token) {
          throw new Error('Respuesta inválida del servidor (sin token).');
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRoles', JSON.stringify(data.roles ?? []));
        localStorage.setItem('username', this.LoginDto.username);
        localStorage.setItem('userId', JSON.stringify(data.userId));

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Has iniciado sesión correctamente',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/analytics']);
        });
      },
      error: (err: Error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: err?.message ?? 'Credenciales incorrectas.'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  restablecerContrasena() {
    if (this.loading) return;
    this.router.navigate(['/reset-password']);
  }
}
