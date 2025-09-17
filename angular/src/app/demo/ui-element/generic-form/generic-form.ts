/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
=======
import {
  Component, EventEmitter, inject, Input, OnChanges, OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators
} from '@angular/forms';
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
<<<<<<< HEAD
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
=======
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { FieldConfig } from './field-config.model';
import { DynamicValidatorService } from './dynamic-validator.service';

import Swal from 'sweetalert2'; // 👈 añadido para la confirmación
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6

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
<<<<<<< HEAD
=======

>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
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

  private buildForm(): void {
    const group: any = {};

<<<<<<< HEAD
    this.config.forEach(f => {
      const defaultValue =
        f.type === 'toggle' ? false :
        (f.type === 'select' && (f as any).multiple) ? [] :
        (f.value ?? '');

      const validators: ValidatorFn[] = [];

      if (f.required) {
        validators.push(Validators.required);
      }

      if (f.validations?.length) {
        f.validations.forEach(val => {
          switch (val.validator) {
            case 'minlength':
              validators.push(Validators.minLength(val.value));
              break;
            case 'maxlength':
              validators.push(Validators.maxLength(val.value));
              break;
            case 'pattern':
              validators.push(Validators.pattern(val.value));
              break;
            case 'required':
              if (!validators.includes(Validators.required)) validators.push(Validators.required);
              break;
            case 'min':
              validators.push(Validators.min(val.value));
              break;
            case 'max':
              validators.push(Validators.max(val.value));
              break;

            // ↓↓↓ NUEVO: validadores de fecha
            case 'MinDate':
              validators.push(this.dateBoundaryValidator(val.value, 'MinDate', 'min'));
              break;
            case 'MaxDate':
              validators.push(this.dateBoundaryValidator(val.value, 'MaxDate', 'max'));
              break;
               case 'MinTime':
        validators.push(this.timeBoundaryValidator(val.value, 'MinTime', 'min')); break;
      case 'MaxTime':
        validators.push(this.timeBoundaryValidator(val.value, 'MaxTime', 'max')); break;
          }
        });
      }

      group[f.name] = [defaultValue, validators];
    });

    if (!group['id'] && this.initialData && this.initialData.id !== undefined) {
      group['id'] = [this.initialData.id];
=======
    // Asegura 'id' antes (para currentId en el validador async)
    if (this.initialData && this.initialData.id !== undefined) {
      group['id'] = new FormControl(this.initialData.id);
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
    }

    this.config.forEach(f => {
      const defaultValue =
        f.type === 'toggle' ? false :
        (f.type === 'select' && (f as any).multiple) ? [] :
        (f.value ?? '');

      const { sync, async } = this.dynamicValidator.getValidators(
        f.validations,
        this.uniqueCheck,
        f.name
      );

      if (f.required && !sync.includes(Validators.required)) {
        sync.push(Validators.required);
      }

      group[f.name] = this.fb.control(defaultValue, {
        validators: sync,
        asyncValidators: async,
        updateOn: 'blur' // dispara validación al salir del campo
      });
    });

    this.form = this.fb.group(group);
  }

  private patchInitialData(): void {
    if (this.initialData.id !== undefined && !this.form.get('id')) {
      this.form.addControl('id', new FormControl(this.initialData.id));
    }
    this.form.patchValue(this.initialData);
  }

  // Espera a que terminen validadores async y luego emite si es válido
  onSubmit(): void {
    // Fuerza a reevaluar todos los controles (por si no se hizo blur)
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
<<<<<<< HEAD
    console.log('Payload que se va a emitir:', this.form.value);
    this.saveForm.emit(this.form.value);
=======

    this.tryEmit();
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
  }

  private tryEmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // (opcional) logs para depurar qué control bloquea
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

  // ✅ Confirmación condicional de cancelación
  onCancel(): void {
    // Si no hay datos relevantes o cambios, cancela sin alertas
    if (!this.shouldConfirmCancel()) {
      this.cancelForm.emit();
      return;
    }

    // Si hay datos/cambios, pedir confirmación
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
   * Regla:
   * - En edición (o si hay initialData): confirmar solo si hubo cambios (form.dirty).
   * - En creación (sin initialData): confirmar si algún control tiene valor no vacío.
   */
  private shouldConfirmCancel(): boolean {
    const hasInitial =
      !!this.initialData && Object.keys(this.initialData).length > 0;

    if (this.isEdit || hasInitial) {
      return this.form.dirty;
    }

    return this.hasAnyNonEmptyValue();
  }

  /** Detecta si algún control tiene valor no vacío (arrays con elementos, boolean true, strings con texto, números no null). */
  private hasAnyNonEmptyValue(): boolean {
    return Object.values(this.form.controls).some(c => {
      const v = c.value;

      if (Array.isArray(v)) return v.length > 0;        // selects múltiples
      if (typeof v === 'boolean') return v === true;     // toggles
      if (v === null || v === undefined) return false;
      if (typeof v === 'number') return true;            // número ingresado (0 también cuenta)
      const s = String(v).trim();
      return s.length > 0;                               // texto/textarea/select simple
    });
  }

  compareByValue = (o1: any, o2: any): boolean => {
    if (o1 === o2) return true;
    if (!o1 || !o2) return false;
    if (o1.id !== undefined && o2.id !== undefined) return o1.id === o2.id;
    if (o1.value !== undefined && o2.value !== undefined) return o1.value === o2.value;
    return JSON.stringify(o1) === JSON.stringify(o2);
  };

<<<<<<< HEAD
  /* =======================
     Helpers para fechas
     ======================= */

  /** Normaliza a 'YYYY-MM-DD' (string) o null */
  private asYmd(v: any): string | null {
    if (!v) return null;
    if (typeof v === 'string') {
      if (v.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0,10);
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d.toISOString().slice(0,10);
    }
    if (v instanceof Date) return v.toISOString().slice(0,10);
    return null;
  }
   /** Validador genérico de fecha mínima/máxima. Devuelve error con la misma key que usas en tu config. */
  private dateBoundaryValidator(boundary: any, errorKey: 'MinDate'|'MaxDate', mode: 'min'|'max'): ValidatorFn {
    const boundaryYmd = this.asYmd(boundary);
    return (control: AbstractControl) => {
      if (!control.value || !boundaryYmd) return null;
      const valueYmd = this.asYmd(control.value);
      if (!valueYmd) return null;

      // Comparación lexicográfica segura en formato YYYY-MM-DD
      const fail = mode === 'min'
        ? (valueYmd < boundaryYmd)
        : (valueYmd > boundaryYmd);

      return fail ? { [errorKey]: true } : null;
    };
  }

  /** Para setear atributos [min]/[max] del input date desde la config */
  getDateBoundary(field: FieldConfig, name: 'MinDate'|'MaxDate'): string | null {
    const rule = field.validations?.find(v => v.validator === name || v.name === name);
    return this.asYmd(rule?.value);
  }

  /* === helpers de hora === */
private toHm(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    // esperamos HH:mm (el input type="time" lo da así)
    const m = value.match(/^(\d{1,2}):(\d{2})/);
    if (!m) return null;
    const hh = ('0' + m[1]).slice(-2);
    const mm = m[2];
    return `${hh}:${mm}`;
  }
  return null;
}
getTimeBoundary(field: FieldConfig, name: 'MinTime'|'MaxTime'): string | null {
  const rule = field.validations?.find(v => v.validator === name || v.name === name);
  return this.toHm(rule?.value);
}
private timeBoundaryValidator(boundary: any, errorKey: 'MinTime'|'MaxTime', mode: 'min'|'max'): ValidatorFn {
  const b = this.toHm(boundary);
  return (ctrl: AbstractControl) => {
    if (!ctrl.value || !b) return null;
    const v = this.toHm(ctrl.value); if (!v) return null;
    const fail = mode === 'min' ? (v < b) : (v > b);  // 'HH:mm' compara lexicográficamente bien
    return fail ? { [errorKey]: true } : null;
  };
}
=======
  isString(value: any): boolean {
    return typeof value === 'string';
  }

  // (opcional) agrega (mousemove)="onRipple($event)" al botón submit
  onRipple(e: MouseEvent) {
    const el = e.target as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  }

  trackByName = (_: number, f: FieldConfig) => f.name;
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
}
