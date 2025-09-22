// angular & app imports
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { General } from 'src/app/generic/general.service';
<<<<<<< HEAD
=======
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// project import
>>>>>>> e9076a282ddcfa699d6b6deba241f4e31f07d85e
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

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
<<<<<<< HEAD
  imports: [SharedModule, RouterModule],
=======
  imports: [SharedModule, RouterModule, FormsModule,MatProgressSpinnerModule],
>>>>>>> e9076a282ddcfa699d6b6deba241f4e31f07d85e
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  LoginDto = {
    username: '',
    password: ''
  };

  // 👁️ Mostrar/ocultar contraseña en el input del template
  showPwd = false;
  togglePwd(): void { this.showPwd = !this.showPwd; }

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

    this.service.post<ApiResponse<AuthData>>('User/login', this.LoginDto).subscribe({
      next: (response) => {
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
        console.error('Error en login:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Error desconocido. Intenta más tarde.'
        });
      }
    });
  }

  restablecerContrasena() {
    this.router.navigate(['/reset-password']);
  }
}
