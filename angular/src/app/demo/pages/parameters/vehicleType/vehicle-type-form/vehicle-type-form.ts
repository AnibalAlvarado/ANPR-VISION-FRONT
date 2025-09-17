/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { VehicleType } from '../vehicle-type';
import { UniqueCheckService } from 'src/app/demo/ui-element/generic-form/unique-check.service';

@Component({
  selector: 'app-vehicle-type-form',
  standalone: true,
  imports: [GenericForm],
  templateUrl: './vehicle-type-form.html',
  styleUrl: './vehicle-type-form.scss'
})
export class VehicleTypeForm implements OnInit {
  formConfig: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required,   validator: ValidatorNames.Required,   message: 'El nombre es obligatorio.' },
        { name: ValidatorNames.MinLength,  validator: ValidatorNames.MinLength,  value: 3,  message: 'El nombre debe tener al menos 3 caracteres.' },
        { name: ValidatorNames.MaxLength,  validator: ValidatorNames.MaxLength,  value: 15, message: 'El nombre no puede exceder los 15 caracteres.' },
        { name: ValidatorNames.Pattern,    validator: ValidatorNames.Pattern,    value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'El nombre solo puede contener letras y espacios.' },
        { name: ValidatorNames.UniqueName, validator: ValidatorNames.UniqueName, message: 'El nombre ya existe.' }
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
  initialData: Partial<VehicleType> = {};

  private service        = inject(General);
  private router         = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private uniqueService  = inject(UniqueCheckService);

  constructor() {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: VehicleType }>('TypeVehicle', id)
        .subscribe({
          next: (response) => {
            if (response.success) this.initialData = response.data;
          },
          error: (err) => {
            console.error('Error cargando TypeVehicle:', err);
            Swal.fire('Error', 'No se pudo cargar el registro.', 'error');
          }
        });
    }
  }

  // Validación asíncrona de unicidad (para usar en <generic-form>)
  uniqueCheck = (fieldName: string, value: unknown, formValue: unknown) =>
    this.uniqueService.checkUnique('TypeVehicle', fieldName, value, formValue);

  save(data: unknown) {
    if (this.isEdit) {
      this.service.put('TypeVehicle', data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro actualizado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          this.router.navigate(['/TypeVehicle-index']);
        },
        error: (err) => {
          console.error('POST/PUT error:', err);
          Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
        }
      });
    } else {
      delete (data as { id?: unknown }).id;
      this.service.post('TypeVehicle', data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro creado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          this.router.navigate(['/TypeVehicle-index']);
        },
        error: (err) => {
          console.error('POST/PUT error:', err);
          Swal.fire('Error', 'No se pudo crear el registro.', 'error');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/TypeVehicle-index']);
  }
}
