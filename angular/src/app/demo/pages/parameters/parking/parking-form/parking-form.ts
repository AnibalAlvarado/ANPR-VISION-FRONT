/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { ParkingCtegory } from '../../parkingCategory/parking-ctegory';

@Component({
  selector: 'app-parking-form',
  imports: [GenericForm],
  templateUrl: './parking-form.html',
  styleUrl: './parking-form.scss'
})
export class ParkingForm implements OnInit {
 formConfig: FieldConfig[] = [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'location', label: 'Ubicación', type: 'text', required: true },

    {
      name: 'parkingCategoryId',
      label: 'Categoría del Parqueadero',
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

    // Cargar categorias de parqueadero
    this.service.get<{ data: ParkingCtegory[]}>('ParkingCategory/select')
      .subscribe(response => {
        if ( response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'parkingCategoryId') {
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
      this.service.getById<{ success: boolean; data: any }>('Parking', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Parking', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/parking-index']);
      });
    } else {
      delete data.id;
      this.service.post('Parking', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/parking-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/parking-index']);
  }
}
