/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Permission } from 'src/app/generic/Models/Entitys';
<<<<<<< HEAD
=======
import { UniqueCheckService } from 'src/app/demo/ui-element/generic-form/unique-check.service';
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [GenericForm],
  templateUrl: './permission-form.html',
  styleUrl: './permission-form.scss'
})
export class PermissionForm implements OnInit {
  formConfig: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required,   validator: ValidatorNames.Required,   message: 'El nombre es obligatorio.' },
        { name: ValidatorNames.MinLength,  validator: ValidatorNames.MinLength,  value: 3,  message: 'El nombre debe tener al menos 3 caracteres.' },
        { name: ValidatorNames.MaxLength,  validator: ValidatorNames.MaxLength,  value: 50, message: 'El nombre no puede exceder los 50 caracteres.' },
        { name: ValidatorNames.Pattern,    validator: ValidatorNames.Pattern,    value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'El nombre solo puede contener letras y espacios.' },
        { name: ValidatorNames.UniqueName, validator: ValidatorNames.UniqueName, message: 'El nombre ya existe.' }
      ]
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      required: true,
      validations: [
<<<<<<< HEAD
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La descripción es obligatoria.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 5, message: 'La descripción debe tener al menos 5 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 200, message: 'La descripción no puede exceder los 200 caracteres.' },
        { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'La descripción solo puede contener letras y espacios.' }
=======
        { name: ValidatorNames.Required,   validator: ValidatorNames.Required,   message: 'La descripción es obligatoria.' },
        { name: ValidatorNames.MinLength,  validator: ValidatorNames.MinLength,  value: 5,   message: 'La descripción debe tener al menos 5 caracteres.' },
        { name: ValidatorNames.MaxLength,  validator: ValidatorNames.MaxLength,  value: 200, message: 'La descripción no puede exceder los 200 caracteres.' },
        { name: ValidatorNames.Pattern,    validator: ValidatorNames.Pattern,    value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'La descripción solo puede contener letras y espacios.' }
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
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
  initialData: Partial<Permission> = {};

  private service        = inject(General);
  private router         = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private uniqueService  = inject(UniqueCheckService);

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.service.getById<Permission>('Permission', id).subscribe({
        next: (perm) => {
          this.initialData = this.normalize(perm);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo cargar el permiso.', 'error');
          this.route.navigate(['/permission-index']);
        }
      });
    }
  }

<<<<<<< HEAD
  private normalize(p: any) {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      asset: p.asset ?? true
    };
  }

  save(data: any) {
=======
  // Callback para validación de unicidad que usará <generic-form>
  uniqueCheck = (fieldName: string, value: unknown, formValue: unknown) =>
    this.uniqueService.checkUnique('Permission', fieldName, value, formValue);

  save(data: unknown) {
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
    if (this.isEdit) {
      this.service.put('Permission', data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro actualizado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
<<<<<<< HEAD
          this.route.navigate(['/permission-index']);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo actualizar el registro.', 'error');
        }
      });
    } else {
      const payload = { ...data };
      delete payload.id;

      this.service.post('Permission', payload).subscribe({
=======
          this.router.navigate(['/permission-index']);
        },
        error: (err) => {
          console.error('POST/PUT error:', err);
          Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
        }
      });
    } else {
      delete (data as { id?: unknown }).id;
      this.service.post('Permission', data).subscribe({
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro creado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
<<<<<<< HEAD
          this.route.navigate(['/permission-index']);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo crear el registro.', 'error');
=======
          this.router.navigate(['/permission-index']);
        },
        error: (err) => {
          console.error('POST/PUT error:', err);
          Swal.fire('Error', 'No se pudo crear el registro.', 'error');
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/permission-index']);
  }
}
