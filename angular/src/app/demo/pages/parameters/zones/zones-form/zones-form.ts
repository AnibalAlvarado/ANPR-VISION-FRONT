/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Parking } from '../../parking/parking';

@Component({
  selector: 'app-zones-form',
  imports: [GenericForm],
  templateUrl: './zones-form.html',
  styleUrl: './zones-form.scss'
})
export class ZonesForm implements OnInit {
 formConfig: FieldConfig[] = [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
    {
      name: 'parkingId',
      label: 'Parqueadero',
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
    this.service.get<{ data: Parking[]}>('Parking/select')
      .subscribe(response => {
        if ( response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'parkingId') {
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
      this.service.getById<{ success: boolean; data: any }>('Zones', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Zones', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/Zones-index']);
      });
    } else {
      delete data.id;
      this.service.post('Zones', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/Zones-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/Zones-index']);
  }
}
