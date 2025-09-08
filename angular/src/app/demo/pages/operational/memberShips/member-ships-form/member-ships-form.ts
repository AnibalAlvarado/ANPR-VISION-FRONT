/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { MembershipsType } from '../../../parameters/membershipsType/memberships-type';
import { Vehicle } from 'src/app/generic/Models/Entitys';

@Component({
  selector: 'app-member-ships-form',
  imports: [GenericForm],
  templateUrl: './member-ships-form.html',
  styleUrl: './member-ships-form.scss'
})
export class MemberShipsForm implements OnInit {
formConfig: FieldConfig[] = [
 {
    name: 'membershipTypeId',
    label: 'Tipo de Membresía',
    type: 'select',
    required: true,
    options: [],
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un tipo de membresía.' }
    ]
  },
  {
    name: 'vehicleId', // <- minúscula
    label: 'Vehículo',
    type: 'select',
    required: true,
    options: [],
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un vehículo.' }
    ]
  },
  {
    name: 'startDate',
    label: 'Fecha de Inicio',
    type: 'date', // <- date
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La fecha de inicio es obligatoria.' },
      { name: ValidatorNames.MinDate, validator: ValidatorNames.MinDate, value: new Date().toISOString().split('T')[0], message: 'La fecha de inicio no puede ser anterior a hoy.' }
    ]
  },
  {
    name: 'endDate',
    label: 'Fecha de Fin',
    type: 'date', // <- date
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La fecha de fin es obligatoria.' }
      // (si tienes validador cruzado en GenericForm, úsalo para endDate > startDate)
    ]
  },
  {
    name: 'priceAtPurchase',
    label: 'Precio al Comprar',
    type: 'number',
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El precio es obligatorio.' },
      { name: ValidatorNames.Min, validator: ValidatorNames.Min, value: 1, message: 'El precio debe ser mayor a 0.' }
    ]
  },
  {
    name: 'durationDays',
    label: 'Duración (días)',
    type: 'number',
    required: true,
    validations: [
      { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La duración es obligatoria.' },
      { name: ValidatorNames.Min, validator: ValidatorNames.Min, value: 1, message: 'La duración debe ser mayor a 0.' }
    ]
  },
  {
    name: 'currency',
    label: 'Moneda',
    type: 'text',
    required: false,
    validations: [
      { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 3, message: 'La moneda no puede superar los 3 caracteres.' },
      { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^[A-Z]{3}$', message: 'La moneda debe ser 3 letras mayúsculas (ej: USD, COP).' }
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
this.service.get<{ data: MembershipsType[] }>('MemberShipType/select')
  .subscribe(response => {
    if (response.data) {
      this.formConfig = this.formConfig.map(field => {
        if (field.name === 'membershipTypeId') {
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
this.service.get<{ data: Vehicle[] }>('Vehicle/select')
  .subscribe(response => {
    if (response.data) {
      this.formConfig = this.formConfig.map(field => {
        if (field.name === 'vehicleId') { // <- minúscula
          return {
            ...field,
            options: response.data.map(item => ({ value: item.id, label: item.plate }))
          };
        }
        return field;
      });
    }
  });

    // Modo edición
    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: any }>('MemberShips', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('MemberShips', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/memberShips-index']);
      });
    } else {
      delete data.id;
      this.service.post('MemberShips', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/memberShips-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/memberShips-index']);
  }
}
