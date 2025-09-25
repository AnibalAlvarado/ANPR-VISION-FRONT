/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { FieldConfig } from './field-config.model';
import { DynamicValidatorService } from './dynamic-validator.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './generic-form.html',
  styleUrl: './generic-form.scss'
})
export class GenericForm implements OnInit, OnChanges {

  @Input() uniqueCheck?: (
    fieldName: string,
    value: any,
    formValue: any
  ) => Observable<{ exists: boolean; message?: string }>;

  @Input() config: FieldConfig[] = [];
  @Input() isEdit = false;
  @Input() initialData: any = {};
  @Input() title: string = '';

  @Output() saveForm = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<void>();


  form!: FormGroup;

  private fb = inject(FormBuilder);
  private dynamicValidator = inject(DynamicValidatorService);

  ngOnInit(): void {
    this.buildForm();
    if (this.initialData && Object.keys(this.initialData).length) {
      this.patchInitialData();
    }
  }
  isString(value: any): value is string {
    return typeof value === 'string' || value instanceof String;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['initialData'] &&
      changes['initialData'].currentValue &&
      Object.keys(changes['initialData'].currentValue).length
    ) {
      if (!this.form) this.buildForm();
      this.patchInitialData();
    }

    if (changes['config'] && !changes['config'].isFirstChange()) {
      this.buildForm();
      this.patchInitialData();
    }
  }

  /** Construye el formulario a partir de la configuración */
  private buildForm(): void {
    const group: { [key: string]: FormControl } = {};

    this.config.forEach(f => {
      const defaultValue =
        f.type === 'toggle' ? false :
        (f.type === 'select' && (f as any).multiple) ? [] :
        (f.value ?? '');

      // Obtén validadores dinámicos (sync/async) de tu servicio
      const { sync, async } = this.dynamicValidator.getValidators(
        f.validations,
        this.uniqueCheck,
        f.name
      );

      // Asegura 'required' si aplica
      if (f.required && !sync.includes(Validators.required)) {
        sync.push(Validators.required);
      }

      // Añade validadores de límites de fecha/hora si vienen en la config
      if (f.validations?.length) {
        f.validations.forEach(v => {
          switch (v.validator) {
            case 'MinDate':
              sync.push(this.dateBoundaryValidator(v.value, 'MinDate', 'min'));
              break;
            case 'MaxDate':
              sync.push(this.dateBoundaryValidator(v.value, 'MaxDate', 'max'));
              break;
            case 'MinTime':
              sync.push(this.timeBoundaryValidator(v.value, 'MinTime', 'min'));
              break;
            case 'MaxTime':
              sync.push(this.timeBoundaryValidator(v.value, 'MaxTime', 'max'));
              break;
            case 'minlength':
              sync.push(Validators.minLength(v.value));
              break;
            case 'maxlength':
              sync.push(Validators.maxLength(v.value));
              break;
            case 'pattern':
              sync.push(Validators.pattern(v.value));
              break;
            case 'min':
              sync.push(Validators.min(v.value));
              break;
            case 'max':
              sync.push(Validators.max(v.value));
              break;
            case 'required':
              if (!sync.includes(Validators.required)) sync.push(Validators.required);
              break;
          }
        });
      }

      group[f.name] = this.fb.control(defaultValue, {
        validators: sync,
        asyncValidators: async,
        updateOn: 'blur'
      }) as FormControl;
    });

    // Control 'id' si viene en initialData y no existe en config
    if (this.initialData && this.initialData.id !== undefined && !group['id']) {
      group['id'] = new FormControl(this.initialData.id);
    }

    this.form = this.fb.group(group);
  }

  /** Inyecta los datos iniciales en el formulario */
  private patchInitialData(): void {
    if (this.initialData.id !== undefined && !this.form.get('id')) {
      this.form.addControl('id', new FormControl(this.initialData.id));
    }
    this.form.patchValue(this.initialData);
  }

  /** Envía el formulario (espera validadores async si están pendientes) */
  onSubmit(): void {
    Object.values(this.form.controls).forEach(c => c.updateValueAndValidity());

    if (this.form.pending) {
      this.form.statusChanges
        .pipe(
          filter(status => status !== 'PENDING'),
          take(1)
        )
        .subscribe(() => this.tryEmit());
      return;
    }

    this.tryEmit();
  }

  private tryEmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Debug opcional para saber qué control bloquea
      Object.keys(this.form.controls).forEach(k => {
        const c = this.form.get(k);
        if (c?.invalid) console.warn('Control inválido:', k, c?.errors);
      });
      return;
    }

    const payload = this.form.getRawValue();
    console.log('Payload que se va a emitir:', payload);
    this.saveForm.emit(payload);
  }

  /** Confirmación condicional de cancelación */
  onCancel(): void {
    if (!this.shouldConfirmCancel()) {
      this.cancelForm.emit();
      return;
    }

    Swal.fire({
      title: '¿Cancelar cambios?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar editando'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelForm.emit();
      }
    });
  }

  /**
   * - En edición (o si hay initialData): confirmar solo si hubo cambios (form.dirty).
   * - En creación (sin initialData): confirmar si algún control tiene valor no vacío.
   */
  private shouldConfirmCancel(): boolean {
    const hasInitial = !!this.initialData && Object.keys(this.initialData).length > 0;
    if (this.isEdit || hasInitial) return this.form.dirty;
    return this.hasAnyNonEmptyValue();
  }

  /** Detecta si algún control tiene valor no vacío */
  private hasAnyNonEmptyValue(): boolean {
    return Object.values(this.form.controls).some(c => {
      const v = c.value;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'boolean') return v === true;
      if (v === null || v === undefined) return false;
      if (typeof v === 'number') return true; // 0 también cuenta
      const s = String(v).trim();
      return s.length > 0;
    });
  }

  compareByValue = (o1: any, o2: any): boolean => {
    if (o1 === o2) return true;
    if (!o1 || !o2) return false;
    if (o1.id !== undefined && o2.id !== undefined) return o1.id === o2.id;
    if (o1.value !== undefined && o2.value !== undefined) return o1.value === o2.value;
    return JSON.stringify(o1) === JSON.stringify(o2);
  };

  /* =======================
     Helpers para fechas
     ======================= */

  /** Normaliza a 'YYYY-MM-DD' (string) o null */
  private asYmd(v: any): string | null {
    if (!v) return null;
    if (typeof v === 'string') {
      if (v.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
    }
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    return null;
  }

  /** Validador min/max de fecha */
  private dateBoundaryValidator(boundary: any, errorKey: 'MinDate' | 'MaxDate', mode: 'min' | 'max'): ValidatorFn {
    const boundaryYmd = this.asYmd(boundary);
    return (control: AbstractControl) => {
      if (!control.value || !boundaryYmd) return null;
      const valueYmd = this.asYmd(control.value);
      if (!valueYmd) return null;

      const fail = mode === 'min'
        ? (valueYmd < boundaryYmd)
        : (valueYmd > boundaryYmd);

      return fail ? { [errorKey]: true } : null;
    };
  }

  /** Para [min]/[max] en inputs date desde config */
  getDateBoundary(field: FieldConfig, name: 'MinDate' | 'MaxDate'): string | null {
    const rule = field.validations?.find(v => v.validator === name || (v as any).name === name);
    return this.asYmd(rule?.value);
  }

  /* === Helpers de hora === */
  private toHm(value: any): string | null {
    if (!value) return null;
    if (typeof value === 'string') {
      const m = value.match(/^(\d{1,2}):(\d{2})/);
      if (!m) return null;
      const hh = ('0' + m[1]).slice(-2);
      const mm = m[2];
      return `${hh}:${mm}`;
    }
    return null;
  }

  getTimeBoundary(field: FieldConfig, name: 'MinTime' | 'MaxTime'): string | null {
    const rule = field.validations?.find(v => v.validator === name || (v as any).name === name);
    return this.toHm(rule?.value);
  }

  private timeBoundaryValidator(boundary: any, errorKey: 'MinTime' | 'MaxTime', mode: 'min' | 'max'): ValidatorFn {
    const b = this.toHm(boundary);
    return (ctrl: AbstractControl) => {
      if (!ctrl.value || !b) return null;
      const v = this.toHm(ctrl.value); if (!v) return null;
      const fail = mode === 'min' ? (v < b) : (v > b);
      return fail ? { [errorKey]: true } : null;
    };
  }

  // (opcional) agrega (mousemove)="onRipple($event)" al botón submit
  onRipple(e: MouseEvent) {
    const el = e.target as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  }

  trackByName = (_: number, f: FieldConfig) => f.name;
}
