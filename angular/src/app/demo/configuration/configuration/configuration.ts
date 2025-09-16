/* eslint-disable @angular-eslint/prefer-inject */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
type TabKey = 'perfil' | 'seguridad' | 'notificaciones' | 'pagos' | 'apariencia';

@Component({
  selector: 'app-configuration',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.scss'
})
export class Configuration implements OnInit {
 activeTab: TabKey = 'perfil';

  perfilForm!: FormGroup;
  passwordForm!: FormGroup;
  notifForm!: FormGroup;
  pagosForm!: FormGroup;
  aparienciaForm!: FormGroup;

  user = {
    nombre: 'Prokhorova Nikol',
    email: 'nikol@example.com',
    telefono: '+278 965 236 25',
    ciudad: 'Bogotá',
    pais: 'Colombia'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.user.nombre, [Validators.required, Validators.minLength(3)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      telefono: [this.user.telefono],
      ciudad: [this.user.ciudad],
      pais: [this.user.pais]
    });

    this.passwordForm = this.fb.group({
      actual: ['', [Validators.required]],
      nueva: ['', [Validators.required, Validators.minLength(8)]],
      confirmar: ['', [Validators.required]]
    });

    this.notifForm = this.fb.group({
      email: [true],
      sms: [false],
      push: [true],
      resumenSemanal: [true]
    });

    this.pagosForm = this.fb.group({
      metodoPreferido: ['visa'],
      recordatorioPago: [true]
    });

    this.aparienciaForm = this.fb.group({
      tema: ['auto'],
      densa: [false],
      animaciones: [true]
    });
  }

  setTab(tab: TabKey) {
    this.activeTab = tab;
  }

  guardarPerfil() {
    if (this.perfilForm.invalid) return this.perfilForm.markAllAsTouched();
    console.log('Perfil ->', this.perfilForm.value);
  }

  cambiarPassword() {
    if (this.passwordForm.invalid) return this.passwordForm.markAllAsTouched();
    const { nueva, confirmar } = this.passwordForm.value;
    if (nueva !== confirmar) {
      this.passwordForm.get('confirmar')?.setErrors({ mismatch: true });
      return;
    }
    console.log('Password ->', this.passwordForm.value);
  }

  guardarNotificaciones() {
    console.log('Notificaciones ->', this.notifForm.value);
  }

  guardarPagos() {
    console.log('Pagos ->', this.pagosForm.value);
  }

  guardarApariencia() {
    console.log('Apariencia ->', this.aparienciaForm.value);
}

}
