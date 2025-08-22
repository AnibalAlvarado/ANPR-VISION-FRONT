/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Zones } from '../../zones/zones';
import { VehicleType } from '../../vehicleType/vehicle-type';

@Component({
  selector: 'app-sectors-form',
  imports: [GenericForm],
  templateUrl: './sectors-form.html',
  styleUrl: './sectors-form.scss'
})
export class SectorsForm implements OnInit {
 formConfig: FieldConfig[] = [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'capacity', label: 'Capacidad', type: 'number', required: true },

    {
      name: 'zonesId',
      label: 'Zona a la que pertenece',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'typeVehicleId',
      label: 'Tipo de Vehículo',
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

    // Cargar zonas
    this.service.get<{ data: Zones[]}>('Zones/select')
      .subscribe(response => {
        if ( response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'zonesId') {
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



    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: any }>('Sectors', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Sectors', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/sectors-index']);
      });
    } else {
      delete data.id;
      this.service.post('Sectors', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/sectors-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/sectors-index']);
  }
}
