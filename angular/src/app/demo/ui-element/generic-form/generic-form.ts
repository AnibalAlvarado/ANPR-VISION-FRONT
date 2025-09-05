/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FieldConfig } from './field-config.model';
import { MatSelectModule } from '@angular/material/select';
import { DynamicValidatorService } from './dynamic-validator.service';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

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
    MatSelectModule
  ],
  templateUrl: './generic-form.html',
  styleUrl: './generic-form.scss'
})
export class GenericForm implements OnInit, OnChanges {
  @Input() uniqueCheck?: (fieldName: string, value: any, formValue: any) =>
    Observable<{ exists: boolean; message?: string }>;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && changes['initialData'].currentValue && Object.keys(changes['initialData'].currentValue).length) {
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

    // Asegura 'id' antes (para currentId en el validador async)
    if (this.initialData && this.initialData.id !== undefined) {
      group['id'] = new FormControl(this.initialData.id);
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

    this.tryEmit();
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

  onCancel(): void {
    this.cancelForm.emit();
  }

  compareByValue = (o1: any, o2: any): boolean => {
    if (o1 === o2) return true;
    if (!o1 || !o2) return false;
    if (o1.id !== undefined && o2.id !== undefined) return o1.id === o2.id;
    if (o1.value !== undefined && o2.value !== undefined) return o1.value === o2.value;
    return JSON.stringify(o1) === JSON.stringify(o2);
  };

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  trackByName = (_: number, f: FieldConfig) => f.name;
}
