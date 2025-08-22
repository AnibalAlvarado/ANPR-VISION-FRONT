/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Form, Permission, Role } from 'src/app/generic/Models/Entitys';

@Component({
  selector: 'app-rol-form-per-form',
  imports: [GenericForm],
  templateUrl: './rol-form-per-form.html',
  styleUrl: './rol-form-per-form.scss'
})
export class RolFormPerForm implements OnInit {
 formConfig: FieldConfig[] = [
    {
      name: 'rolId',
      label: 'Rol',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'permissionId',
      label: 'Permiso',
      type: 'select',
      required: true,
      options: []
    },
     {
      name: 'formId',
      label: 'Formulario',
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

    // Cargar roles
    this.service.get<{ data: Role[]}>('Rol/select')
      .subscribe(response => {
        if ( response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'rolId') {
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



    // Cargar permisos
    this.service.get<{ data: Permission[] }>('Permission/select').subscribe(response => {
        if (response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'permissionId') {
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

       // Cargar formularios
    this.service.get<{ data: Form[] }>('Form/select').subscribe(response => {
        if (response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'formId') {
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
      this.service.getById<{ success: boolean; data: any }>('RolFormPermission', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('RolFormPermission', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/rolFormPermission-index']);
      });
    } else {
      delete data.id;
      this.service.post('RolFormPermission', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/rolFormPermission-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/rolFormPermission-index']);
  }
}
