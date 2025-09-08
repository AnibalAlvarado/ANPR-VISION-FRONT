/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import { Vehicle } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-black-list-form',
  imports: [GenericForm],
  templateUrl: './black-list-form.html',
  styleUrl: './black-list-form.scss'
})
export class BlackListForm implements OnInit {
 formConfig: FieldConfig[] = [
    {
      name: 'vehicleId',
      label: 'Vehículo',
      type: 'select',
      required: true,
      options: [],
      validations: [
        {
          name: ValidatorNames.Required,
          validator: ValidatorNames.Required,
          message: 'Debe seleccionar un vehículo.'
        }
      ]
    },
     {
      name: 'reason',
      label: 'Razón',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La razón es obligatoria.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 3, message: 'La razón debe tener al menos 3 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 100, message: 'La razón no puede exceder los 100 caracteres.' },
        { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'La razón solo puede contener letras y espacios.' }
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

    // Cargar formularios
    this.service.get<{ data: Vehicle[] }>('Vehicle/select')
      .subscribe(response => {
        if (response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'vehicleId') {
              return {
                ...field,
                options: response.data.map(item => ({
                  value: item.id,
                  label: item.plate
                }))
              };
            }
            return field;
          });
        }
      });



    // Modo edición
    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: any }>('BlackList', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('BlackList', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/blackList-index']);
      });
    } else {
      delete data.id;
      delete data.restrictionDate;
      this.service.post('BlackList', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/blackList-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/blackList-index']);
  }
}
