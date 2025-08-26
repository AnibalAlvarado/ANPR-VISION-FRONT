/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FieldConfig } from './field-config.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-generic-form',
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
  @Input() config: FieldConfig[] = [];
  @Input() isEdit = false;
  @Input() initialData: any = {};
  @Input() title: string = ''; 
  @Output() saveForm = new EventEmitter<any>();
  @Output() cancelForm = new EventEmitter<void>();

  form!: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {}

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

    this.config.forEach(f => {
      const defaultValue = f.type === 'toggle'
        ? false
        : f.type === 'select' && (f as any).multiple
          ? []
          : (f.value ?? '');

      const validators: ValidatorFn[] = []; 
  
      if (f.required) {
        validators.push(Validators.required);
      }

      if (f.validations && f.validations.length > 0) {
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
              if (!validators.includes(Validators.required)) {
                validators.push(Validators.required);
              }
              break;
            case 'min':
              validators.push(Validators.min(val.value));
              break;
            case 'max':
              validators.push(Validators.max(val.value));
              break;
          }

        });
      }

      group[f.name] = [defaultValue, validators];
    });

    if (!group['id'] && this.initialData && this.initialData.id !== undefined) {
      group['id'] = [this.initialData.id];
    }

    this.form = this.fb.group(group);
  }

  private patchInitialData(): void {
    if (this.initialData.id !== undefined && !this.form.get('id')) {
      this.form.addControl('id', new FormControl(this.initialData.id));
    }
    this.form.patchValue(this.initialData);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Payload que se va a emitir:', this.form.value); 
    this.saveForm.emit(this.form.value);
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
}