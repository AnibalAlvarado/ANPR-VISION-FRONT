/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { General } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = 'User';

  constructor(private general: General) {}

  // Paso 1: solicitar recuperación
  requestPasswordReset(email: string): Observable<any> {
    return this.general.post(`${this.endpoint}/request-password-reset`, { email });
  }

  // Paso 2: verificar código
  verifyCode(email: string, code: string): Observable<any> {
    return this.general.post(`${this.endpoint}/verify-code`, { email, code });
  }

  // Paso 3: resetear contraseña
  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.general.post(`${this.endpoint}/reset-password`, { email, code, newPassword });
  }
}
