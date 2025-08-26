/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { VehicleType } from '../../vehicleType/vehicle-type';

@Component({
  selector: 'app-rate-type-form',
  imports: [GenericForm],
  templateUrl: './rate-type-form.html',
  styleUrl: './rate-type-form.scss'
})
export class RateTypeForm implements OnInit {
  formConfig: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El nombre es obligatorio.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 3, message: 'El nombre debe tener al menos 3 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 50, message: 'El nombre no puede exceder los 50 caracteres.' },
        { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'El nombre solo puede contener letras y espacios.' }
      ]
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La descripción es obligatoria.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 5, message: 'La descripción debe tener al menos 5 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 200, message: 'La descripción no puede exceder los 200 caracteres.' },
         { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'El nombre solo puede contener letras y espacios.' }
      ]
    },
    {
      name: 'asset',
      label: 'Activo',
      type: 'toggle',
      value: true,
      hidden: true   // <-- Esto lo mantiene oculto
    }
  ];

  isEdit = false;
  initialData: any = {};

  private service = inject(General);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service
        .getById<{ success: boolean; data: VehicleType }>('RatesType', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('RatesType', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/RatesType-index']);
      });
    } else {
      delete data.id;
      this.service.post('RatesType', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/RatesType-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/RatesType-index']);
  }
}
