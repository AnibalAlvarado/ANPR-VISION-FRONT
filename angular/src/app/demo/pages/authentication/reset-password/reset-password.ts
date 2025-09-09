/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/generic/Auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
 // === PROPIEDADES ===
  step: number = 1; // 1=solicitar, 2=verificar, 3=resetear, 4=completado
  emailForm!: FormGroup;
  codeForm!: FormGroup;
  resetForm!: FormGroup;
  loading = false;
  message = '';
  email = '';

  // === INYECCIÓN DE DEPENDENCIAS ===
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor(private authService: AuthService) {
    this.initForms();
  }

  // === INICIALIZACIÓN DE FORMULARIOS ===
  initForms(): void {
    this.emailForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]]
    });

    this.codeForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^\d{6}$/)
      ]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) // Al menos una minúscula, mayúscula y número
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator
    });
  }


  // (opcional) en (mousemove) del botón: setear las CSS vars
onBtnMove(e: MouseEvent) {
  const t = e.target as HTMLElement;
  const rect = t.getBoundingClientRect();
  t.style.setProperty('--x', `${e.clientX - rect.left}px`);
  t.style.setProperty('--y', `${e.clientY - rect.top}px`);
}

  // === VALIDADORES PERSONALIZADOS ===
  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  // === PASO 1: SOLICITAR RESET ===
  requestReset(): void {
    if (this.emailForm.invalid) {
      this.markFormGroupTouched(this.emailForm);
      return;
    }

    this.loading = true;
    this.message = '';
    this.email = this.emailForm.value.email;

    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.step = 2;
        this.message = 'Código enviado a tu correo electrónico';
        this.startCodeTimer();
      },
      error: (err) => {
        this.loading = false;
        this.message = this.getErrorMessage(err, 'Error al solicitar el restablecimiento');
      }
    });
  }

  // === PASO 2: VERIFICAR CÓDIGO ===
  verifyCode(): void {
    if (this.codeForm.invalid) {
      this.markFormGroupTouched(this.codeForm);
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.verifyCode(this.email, this.codeForm.value.code).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data?.valid) {
          this.step = 3;
          this.message = '✅ Código verificado correctamente';
        } else {
          this.message = '❌ Código inválido. Verifica e intenta nuevamente';
          this.codeForm.patchValue({ code: '' });
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = this.getErrorMessage(err, 'Error al verificar el código');
        this.codeForm.patchValue({ code: '' });
      }
    });
  }

  // === PASO 3: RESETEAR CONTRASEÑA ===
  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.markFormGroupTouched(this.resetForm);
      return;
    }

    this.loading = true;
    this.message = '';

    const { newPassword } = this.resetForm.value;
    const code = this.codeForm.value.code;

    this.authService.resetPassword(this.email, code, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.step = 4;
        this.message = '🎉 Contraseña restablecida con éxito';
        this.autoRedirectToLogin();
      },
      error: (err) => {
        this.loading = false;
        this.message = this.getErrorMessage(err, 'Error al restablecer la contraseña');
      }
    });
  }

  // === MÉTODOS AUXILIARES ===
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private getErrorMessage(error: any, defaultMessage: string): string {
    if (error?.error?.message) {
      return `❌ ${error.error.message}`;
    }
    return `❌ ${defaultMessage}`;
  }

  private startCodeTimer(): void {
    // Timer para reenvío de código (opcional)
    // Puedes implementar un contador regresivo aquí si lo necesitas
  }

  private autoRedirectToLogin(): void {
    // Redirección automática después de 3 segundos
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  // === MÉTODOS PÚBLICOS PARA EL TEMPLATE ===
  goToStep(stepNumber: number): void {
    if (stepNumber < this.step) {
      this.step = stepNumber;
      this.message = '';
    }
  }

  resendCode(): void {
    if (this.step === 2) {
      this.loading = true;
      this.authService.requestPasswordReset(this.email).subscribe({
        next: () => {
          this.loading = false;
          this.message = '📧 Nuevo código enviado';
        },
        error: (err) => {
          this.loading = false;
          this.message = this.getErrorMessage(err, 'Error al reenviar código');
        }
      });
    }
  }

  // === GETTERS PARA VALIDACIONES ===
  get emailErrors() {
    const control = this.emailForm.get('email');
    if (control?.errors && control?.touched) {
      if (control.errors['required']) return 'El correo es requerido';
      if (control.errors['email']) return 'Ingresa un correo válido';
      if (control.errors['pattern']) return 'Formato de correo inválido';
    }
    return null;
  }

  get codeErrors() {
    const control = this.codeForm.get('code');
    if (control?.errors && control?.touched) {
      if (control.errors['required']) return 'El código es requerido';
      if (control.errors['minlength'] || control.errors['maxlength']) {
        return 'El código debe tener 6 dígitos';
      }
      if (control.errors['pattern']) return 'Solo se permiten números';
    }
    return null;
  }

  get passwordErrors() {
    const control = this.resetForm.get('newPassword');
    if (control?.errors && control?.touched) {
      if (control.errors['required']) return 'La contraseña es requerida';
      if (control.errors['minlength']) return 'Mínimo 6 caracteres';
      if (control.errors['pattern']) {
        return 'Debe contener al menos: 1 mayúscula, 1 minúscula y 1 número';
      }
    }
    return null;
  }

  get confirmPasswordErrors() {
    const control = this.resetForm.get('confirmPassword');
    if (control?.errors && control?.touched) {
      if (control.errors['required']) return 'Confirma tu contraseña';
    }
    if (this.resetForm.hasError('mismatch') && control?.touched) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  }

  // === MÉTODOS DE NAVEGACIÓN ===
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  resetFlow(): void {
    this.step = 1;
    this.message = '';
    this.email = '';
    this.loading = false;
    this.initForms();
  }

  // === VALIDACIÓN EN TIEMPO REAL ===
  onEmailInput(): void {
    const emailControl = this.emailForm.get('email');
    if (emailControl?.valid && emailControl?.value) {
      // Opcional: validación en tiempo real
    }
  }

  onCodeInput(): void {
    const codeControl = this.codeForm.get('code');
    if (codeControl?.value?.length === 6) {
      // Auto-submit cuando el código esté completo (opcional)
      // this.verifyCode();
    }
  }

  onPasswordInput(): void {
    // const passwordControl = this.resetForm.get('newPassword');
    const confirmControl = this.resetForm.get('confirmPassword');

    // Revalidar confirmación si ya hay algo escrito
    if (confirmControl?.value) {
      confirmControl.updateValueAndValidity();
    }
  }
}
