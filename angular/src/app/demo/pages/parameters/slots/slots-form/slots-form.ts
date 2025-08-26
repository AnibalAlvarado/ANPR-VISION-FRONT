/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Sectors } from '../../sectors/sectors';

@Component({
  selector: 'app-slots-form',
  imports: [GenericForm],
  templateUrl: './slots-form.html',
  styleUrl: './slots-form.scss'
})
export class SlotsForm implements OnInit {
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
        { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^[a-zA-Z0-9]+$', message: 'El nombre solo puede contener letras y números.' }
      ]
    },
    {
      name: 'sectorsId',
      label: 'Sector al que pertenece',
      type: 'select',
      required: true,
      options: [],
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un sector.' }
      ]
    },
    {
      name: 'isAvailable',
      label: 'Disponible',
      type: 'toggle'
    },
    {
      name: 'asset',
      label: 'Activo',
      type: 'toggle'
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

    // Cargar sectores dinámicamente
    this.service.get<{ data: Sectors[] }>('Sectors/select')
      .subscribe(response => {
        if (response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'sectorsId') {
              return {
                ...field,
                options: response.data.map(item => ({
                  value: item.id,
                  label: item.name
                }))
              };
            }
            return field;
          });
        }
      });

    // Si es edición, cargar datos iniciales
    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: any }>('Slots', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Slots', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/slots-index']);
      });
    } else {
      delete data.id;
      this.service.post('Slots', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/slots-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/slots-index']);
  }
}
