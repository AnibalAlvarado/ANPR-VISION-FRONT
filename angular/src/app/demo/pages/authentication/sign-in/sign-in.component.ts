// angular import
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { General } from 'src/app/generic/general.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

interface AuthData {
  userId: number;
  token: string;
  roles: string[];
  // agrega otros campos si tu back los envía en data
}

@Component({
  selector: 'app-sign-in',
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  LoginDto = {
    username: '',
    password: ''
  };

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

    // ⬇️ OJO: pedimos AuthData (el data del back), no el wrapper
    this.service.post<AuthData>('User/login', this.LoginDto).subscribe({
      next: (data) => {
        // Si estamos aquí, el back respondió OK y success=true
        // (o no hay wrapper). Guardamos credenciales.
        if (!data?.token) {
          // Por si acaso no viene token, muestra error amistoso.
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'Respuesta inválida del servidor.'
          });
          return;
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRoles', JSON.stringify(data.roles ?? []));
        localStorage.setItem('username', this.LoginDto.username);
        localStorage.setItem('userId', JSON.stringify(data.userId));

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: 'Has iniciado sesión correctamente',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/analytics']);
        });
      },
      error: (err: Error) => {
        // Aquí llegan:
        // - 4xx/5xx con payload del back
        // - 200 con success:false (General lanza Error(message))
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: err.message ?? 'Credenciales incorrectas.'
        });
      }
    });
  }

  restablecerContrasena() {
    this.router.navigate(['/reset-password']);
  }
}
