/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { VehicleType } from '../../../parameters/vehicleType/vehicle-type';
import { Client } from 'src/app/generic/Models/Entitys';

@Component({
  selector: 'app-vehicle-form',
  imports: [GenericForm],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss'
})
export class VehicleForm implements OnInit {
 formConfig: FieldConfig[] = [
      { name: 'plate', label: 'Placa', type: 'text', required: true },
      { name: 'color', label: 'Color', type: 'text', required: true },
    {
      name: 'typeVehicleId',
      label: 'Tipo de Vehículo',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'clientId',
      label: 'Dueño del Vehículo',
      type: 'select',
      required: true,
      options: []
    },
      { name: 'asset', label: 'Activo', type: 'toggle' }

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
    this.service.get<{ data: VehicleType[]}>('TypeVehicle/select')
      .subscribe(response => {
        if ( response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'typeVehicleId') {
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

       // Cargar clientes
    this.service.get<{ data: Client[]}>('Client/join')
      .subscribe(response => {
        if ( response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'clientId') {
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





    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: any }>('Vehicle', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Vehicle', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/vehicles-index']);
      });
    } else {
      delete data.id;
      this.service.post('Vehicle', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/vehicles-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/vehicles-index']);
  }
}
