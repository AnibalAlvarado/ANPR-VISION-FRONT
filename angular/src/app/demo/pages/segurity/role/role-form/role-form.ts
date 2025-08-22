/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';

import Swal from 'sweetalert2';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { Role } from 'src/app/generic/Models/Entitys';


@Component({
  selector: 'app-role-form',
    imports: [GenericForm ],
  templateUrl: './role-form.html',
  styleUrl: './role-form.scss'
})
export class RoleForm  implements OnInit{
   formConfig: FieldConfig[] = [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'text', required: true },
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
    this.service.getById<{ success: boolean; data: Role }>('Rol', id).subscribe(response => {
      if (response.success) {
           this.initialData = response.data;

      }
    });
  }
}


  save(data: any) {
    if (this.isEdit) {
      this.service.put('Rol', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro actualizado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/role-index']);
    });
    } else {
       delete data.id;
    this.service.post('Rol', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro creado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/role-index']);
    });
    }
  }

    cancel() {
    this.route.navigate(['/role-index']);
  }
}
