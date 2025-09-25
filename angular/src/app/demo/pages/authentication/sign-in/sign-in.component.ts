// angular & app imports
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

interface AuthData {
  userId: number;
  token: string;
  roles: string[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  // DTO enlazado con ngModel
  public LoginDto = {
    username: '',
    password: ''
  };

  // Propiedad que faltaba en la clase (resuelve el error TS2339)
  public loading: boolean = false;

  // Control para mostrar/ocultar contraseña en el input del template
  public showPwd: boolean = false;
  public togglePwd(): void { this.showPwd = !this.showPwd; }

  private service = inject(General);
  private router = inject(Router);

  constructor() {}

  login() {
    if (!this.LoginDto.username || !this.LoginDto.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingresa tu usuario y contraseña.'
      });
      return;
    }

    // this.loading = true;

    this.service.post<ApiResponse<AuthData>>('User/login', this.LoginDto).subscribe({
      next: (response) => {
        // ocultar overlay al recibir respuesta
        this.loading = false;

        const data = response.data;

        if (response.success && data?.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userRoles', JSON.stringify(data.roles ?? []));
          localStorage.setItem('username', this.LoginDto.username);
          localStorage.setItem('userId', JSON.stringify(data.userId));

          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: response.message || 'Has iniciado sesión correctamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/analytics']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: response.message || 'Credenciales incorrectas.'
          });
        }
      },
      error: (err) => {
        // ocultar overlay si hay error
        this.loading = false;

        console.error('Error en login:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Error desconocido. Intenta más tarde.'
        });
      },
      complete: () => {
        // this.loading = false;
      }
    });
  }

  restablecerContrasena() {
    // if (this.loading) return;
    this.router.navigate(['/reset-password']);
  }
}
