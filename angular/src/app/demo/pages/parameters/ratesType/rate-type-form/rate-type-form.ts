/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
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
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'text', required: true },
      { name: 'asset', label: 'Activo', type: 'toggle' }
    ];

 isEdit = false;
  initialData: any = {};

  private service = inject(General);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);




  constructor() {

  }

  ngOnInit(): void {
  const id = this.activatedRoute.snapshot.paramMap.get('id');
  if (id) {
    this.isEdit = true;
    this.service.getById<{ success: boolean; data: VehicleType }>('RatesType', id).subscribe(response => {
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
