// angular import
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { General } from 'src/app/generic/general.service';


// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    userId: number;
    token: string;
    roles: string[];
    // cualquier otra info que tenga el user
  };
  errors?: string[];
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

  this.service.post<LoginResponse>('User/login', this.LoginDto).subscribe({
    next: (response) => {
      if (response.success && response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRoles', JSON.stringify(response.data.roles));
        localStorage.setItem('username', this.LoginDto.username);
        localStorage.setItem('userId', JSON.stringify(response.data.userId));


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
        text: err.error?.message || 'Error desconocido. Intenta más tarde.'
      });
    }
  });
}

}


