/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import { Form } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';
import { UniqueCheckService } from 'src/app/demo/ui-element/generic-form/unique-check.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-form',
  standalone: true,
  imports: [GenericForm],
  templateUrl: './form-form.html',
  styleUrl: './form-form.scss'
})
export class FormForm implements OnInit {
  formConfig: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required,  validator: ValidatorNames.Required,  message: 'El nombre es obligatorio.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 3,  message: 'El nombre debe tener al menos 3 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 50, message: 'El nombre no puede exceder los 50 caracteres.' },
        { name: ValidatorNames.Pattern,   validator: ValidatorNames.Pattern,   value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'El nombre solo puede contener letras y espacios.' },
        // Usa la clave string 'uniqueName' (el GenericForm la reconoce)
        { name: 'uniqueName', validator: 'uniqueName', message: 'El nombre ya existe.' }
      ]
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required,  validator: ValidatorNames.Required,  message: 'La descripción es obligatoria.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 5,   message: 'La descripción debe tener al menos 5 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 200, message: 'La descripción no puede exceder los 200 caracteres.' },
        { name: ValidatorNames.Pattern,   validator: ValidatorNames.Pattern,   value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'La descripción solo puede contener letras y espacios.' }
      ]
    },
    {
      name: 'asset',
      label: 'Activo',
      type: 'toggle',
      value: true,
      hidden: true
    }
  ];

  isEdit = false;
  initialData: Partial<Form> = {};

  private service        = inject(General);
  private router         = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private uniqueService  = inject(UniqueCheckService);

  // ✅ Usado por <app-generic-form [uniqueCheck]="uniqueCheck">
  uniqueCheck = (
    fieldName: string,
    value: any,
    formValue: any
  ): Observable<{ exists: boolean; message?: string }> => {
    return this.uniqueService.checkUnique('Form', fieldName, value, formValue);
  };

  constructor() {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.getById<Form>('Form', id).subscribe({
        next: (form) => {
          this.initialData = this.normalize(form);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo cargar el formulario.', 'error');
          this.router.navigate(['/form-index']);
        }
      });
    }
  }

  private normalize(f: any) {
    return {
      id: f.id,
      name: f.name,
      description: f.description,
      asset: f.asset ?? true
    };
  }

  // Recibe el payload de <app-generic-form (saveForm)="save($event)">
  save(data: any) {
    if (this.isEdit) {
      this.service.put('Form', data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro actualizado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          this.router.navigate(['/form-index']);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo actualizar el registro.', 'error');
        }
      });
    } else {
      const payload = { ...data };
      delete (payload as any).id;

      this.service.post('Form', payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro creado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          this.router.navigate(['/form-index']);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo crear el registro.', 'error');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/form-index']);
  }
}
