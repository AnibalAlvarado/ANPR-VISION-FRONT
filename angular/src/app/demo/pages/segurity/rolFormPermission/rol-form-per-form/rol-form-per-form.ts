/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
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
      options: [],
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un rol.' }
      ]
    },
    {
      name: 'permissionId',
      label: 'Permiso',
      type: 'select',
      required: true,
      options: [],
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un permiso.' }
      ]
    },
    {
      name: 'formId',
      label: 'Formulario',
      type: 'select',
      required: true,
      options: [],
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un formulario.' }
      ]
    },
    {
      name: 'asset',
      label: 'Activo',
      type: 'toggle'
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

    // Cargar opciones dinámicas
    this.loadSelectOptions<Role>('Rol/select', 'rolId');
    this.loadSelectOptions<Permission>('Permission/select', 'permissionId');
    this.loadSelectOptions<Form>('Form/select', 'formId');

    if (id) {
      this.isEdit = true;
      this.service
        .getById<{ success: boolean; data: any }>('RolFormPermission', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  /**
   * Método genérico para cargar las opciones de los selects dinámicos.
   */
  private loadSelectOptions<T extends { id: number; name: string }>(
    endpoint: string,
    fieldName: string
  ) {
    this.service.get<{ data: T[] }>(endpoint).subscribe(response => {
      if (response.data) {
        this.formConfig = this.formConfig.map(field =>
          field.name === fieldName
            ? {
                ...field,
                options: response.data.map(item => ({
                  value: item.id,
                  label: item.name
                }))
              }
            : field
        );
      }
    });
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
