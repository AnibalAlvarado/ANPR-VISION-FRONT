/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permission-form',
  imports: [GenericForm],
  templateUrl: './permission-form.html',
  styleUrl: './permission-form.scss'
})
export class PermissionForm implements OnInit {
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
    this.service.getById<{ success: boolean; data: Form }>('Permission', id).subscribe(response => {
      if (response.success) {
           this.initialData = response.data;

      }
    });
  }
}


  save(data: any) {
    if (this.isEdit) {
      this.service.put('Permission', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro actualizado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/permission-index']);
    });
    } else {
       delete data.id;
    this.service.post('Permission', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro creado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/permission-index']);
    });
    }
  }

    cancel() {
    this.route.navigate(['/permission-index']);
  }
}
