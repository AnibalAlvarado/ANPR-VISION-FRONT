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
    if (changes['initialData'] && !changes['initialData'].isFirstChange()) {
      if (!this.form) this.buildForm();
      this.patchInitialData();
    }
    if (changes['config'] && !changes['config'].isFirstChange()) {
      // si cambias config en caliente
      this.buildForm();
      this.patchInitialData();
    }
  }

  // private buildForm(): void {
  //   const group: any = {};
  //   this.config.forEach(f => {
  //     group[f.name] = [f.value ?? '', f.required ? Validators.required : []];
  //   });

  //   // Si initialData trae id pero config no lo incluye, crear control id
  //   if (!group['id'] && this.initialData && this.initialData.id !== undefined) {
  //     group['id'] = [this.initialData.id];
  //   }

  //   this.form = this.fb.group(group);
  // }

  private buildForm(): void {
    const group: any = {};
    this.config.forEach(f => {
      const defaultValue = f.type === 'toggle'
        ? false
        : f.type === 'select' && (f as any).multiple
          ? []
          : (f.value ?? '');
      const validators = f.required ? [Validators.required] : [];
      group[f.name] = [defaultValue, validators];
    });

    if (!group['id'] && this.initialData && this.initialData.id !== undefined) {
      group['id'] = [this.initialData.id];
    }

    this.form = this.fb.group(group);
  }

  private patchInitialData(): void {
    // si el form no tiene control id pero initialData sí, lo agrego
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
    console.log('Payload que se va a emitir:', this.form.value); // depuración
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
