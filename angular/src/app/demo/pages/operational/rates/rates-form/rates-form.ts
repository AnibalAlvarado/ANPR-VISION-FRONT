/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { VehicleType } from '../../../parameters/vehicleType/vehicle-type';
import { RateType } from '../../../parameters/ratesType/rate-type';
import { Parking } from '../../../parameters/parking/parking';

@Component({
  selector: 'app-rates-form',
  imports: [GenericForm],
  templateUrl: './rates-form.html',
  styleUrl: './rates-form.scss'
})
export class RatesForm implements OnInit {
formConfig: FieldConfig[] = [
  {
    name: 'type',
    label: 'Tipo',
    type: 'text',
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El tipo es obligatorio.' },
      { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 50, message: 'El tipo no puede superar los 50 caracteres.' }
    ]
  },
  {
    name: 'name',
    label: 'Nombre',
    type: 'text',
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El nombre es obligatorio.' },
      { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 70, message: 'El nombre no puede superar los 70 caracteres.' }
    ]
  },
  {
    name: 'amount',
    label: 'Monto',
    type: 'number',
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El monto es obligatorio.' },
      { name: ValidatorNames.Min, validator: ValidatorNames.Min, value: 1, message: 'El monto debe ser mayor a 0.' }
    ]
  },
  {
    name: 'starHour',
    label: 'Hora de Inicio',
    type: 'date', // formato hora
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La hora de inicio es obligatoria.' }
    ]
  },
  {
    name: 'endHour',
    label: 'Hora de Fin',
    type: 'date', // formato hora
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La hora de fin es obligatoria.' }
      // Si tu GenericForm tiene validador cruzado, agrega lógica para validar endHour > starHour
    ]
  },
  {
    name: 'year',
    label: 'Año',
    type: 'number',
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El año es obligatorio.' },
      { name: ValidatorNames.Min, validator: ValidatorNames.Min, value: 2000, message: 'El año no puede ser menor a 2000.' }
    ]
  },
  {
    name: 'parkingId',
    label: 'Parqueadero',
    type: 'select',
    required: true,
    options: [],
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un parqueadero.' }
    ]
  },
  {
    name: 'ratesTypeId',
    label: 'Tipo de Tarifa',
    type: 'select',
    required: true,
    options: [],
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un tipo de tarifa.' }
    ]
  },
  {
    name: 'typeVehicleId',
    label: 'Tipo de Vehículo',
    type: 'select',
    required: true,
    options: [],
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un tipo de vehículo.' }
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
  initialData: any = {};

  private service = inject(General);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

   // Tipos de membresía
this.service.get<{ data: VehicleType[] }>('TypeVehicle/select')
  .subscribe(response => {
    if (response.data) {
      this.formConfig = this.formConfig.map(field => {
        if (field.name === 'typeVehicleId') {
          return {
            ...field,
            options: response.data.map(item => ({ value: item.id, label: item.name }))
          };
        }
        return field;
      });
    }
  });

// Vehículos
this.service.get<{ data: RateType[] }>('RatesType/select')
  .subscribe(response => {
    if (response.data) {
      this.formConfig = this.formConfig.map(field => {
        if (field.name === 'ratesTypeId') { // <- minúscula
          return {
            ...field,
            options: response.data.map(item => ({ value: item.id, label: item.name }))
          };
        }
        return field;
      });
    }
  });

  this.service.get<{ data: Parking[] }>('Parking/select')
  .subscribe(response => {
    if (response.data) {
      this.formConfig = this.formConfig.map(field => {
        if (field.name === 'parkingId') { // <- minúscula
          return {
            ...field,
            options: response.data.map(item => ({ value: item.id, label: item.name }))
          };
        }
        return field;
      });
    }
  });
    // Modo edición
    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: any }>('Rates', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Rates', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/rates-index']);
      });
    } else {
      delete data.id;
      this.service.post('Rates', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/rates-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/rates-index']);
  }
}
