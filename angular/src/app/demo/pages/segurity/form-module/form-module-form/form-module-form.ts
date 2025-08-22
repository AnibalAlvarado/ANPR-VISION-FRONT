/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Form, Module } from 'src/app/generic/Models/Entitys';

@Component({
  selector: 'app-form-module-form',
  imports: [GenericForm],
  templateUrl: './form-module-form.html',
  styleUrl: './form-module-form.scss'
})
export class FormModuleForm implements OnInit {
 formConfig: FieldConfig[] = [
    {
      name: 'formId',
      label: 'Formulario',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'moduleId',
      label: 'Módulo',
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
    this.service.get<{ data: Form[]}>('Form/select')
      .subscribe(response => {
        if ( response.data) {
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



    // Cargar módulos
    this.service.get<{ data: Module[] }>('Module/select').subscribe(response => {
        if (response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'moduleId') {
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
      this.service.getById<{ success: boolean; data: any }>('FormModule', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('FormModule', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/form-module-index']);
      });
    } else {
      delete data.id;
      this.service.post('FormModule', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/form-module-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/form-module-index']);
  }
}
