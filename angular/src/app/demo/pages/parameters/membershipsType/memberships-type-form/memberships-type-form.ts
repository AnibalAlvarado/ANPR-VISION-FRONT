/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { MembershipsType } from '../memberships-type';

@Component({
  selector: 'app-memberships-type-form',
  imports: [GenericForm],
  templateUrl: './memberships-type-form.html',
  styleUrl: './memberships-type-form.scss'
})
export class MembershipsTypeForm implements OnInit {
formConfig: FieldConfig[] = [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'text', required: true },
      { name: 'durationDaysBase', label: 'Duración(días)', type: 'number', required: true },
      { name: 'priceBase', label: 'Precio', type: 'number', required: true },
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
    this.service.getById<{ success: boolean; data: MembershipsType }>('MemberShipType', id).subscribe(response => {
      if (response.success) {
           this.initialData = response.data;

      }
    });
  }
}


  save(data: any) {
    if (this.isEdit) {
      this.service.put('MemberShipType', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro actualizado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/memberShipType-index']);
    });
    } else {
       delete data.id;
    this.service.post('MemberShipType', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro creado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/memberShipType-index']);
    });
    }
  }

    cancel() {
    this.route.navigate(['/memberShipType-index']);
  }
}
