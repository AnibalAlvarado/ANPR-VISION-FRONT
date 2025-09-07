/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import {  Person } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-form',
  imports: [GenericForm],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm implements OnInit {
  formConfig: FieldConfig[] = [
     {
      name: 'name',
      label: 'Nombre del cliente',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El nombre del cliente es obligatorio.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 2, message: 'El nombre debe tener al menos 2 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 50, message: 'El nombre no puede exceder los 50 caracteres.' },
         { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^[a-zA-ZÀ-ÿ\\s]+$', message: 'El nombre solo puede contener letras y espacios.' }
      ]
    },
    {
      name: 'personId',
      label: 'Persona Asociada',
      type: 'select',
      required: true,
      options: [],
      validations: [
        {
          name: ValidatorNames.Required,
          validator: ValidatorNames.Required,
          message: 'Debe seleccionar una persona.'
        }
      ]
    },
    {
        name: 'asset',
        label: 'Activo',
        type: 'toggle',
        value: true,
        hidden: true   // <-- Esto lo mantiene oculto
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

    // Cargar formularios
    this.service.get<{ data: Person[] }>('Person/select')
      .subscribe(response => {
        if (response.data) {
          this.formConfig = this.formConfig.map(field => {
            if (field.name === 'personId') {
              return {
                ...field,
                options: response.data.map(item => ({
                  value: item.id,
                  label: item.firstName + ' ' + item.lastName
                }))
              };
            }
            return field;
          });
        }
      });


    // Modo edición
    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: any }>('Client', id)
        .subscribe(response => {
          if (response.success) {
            this.initialData = response.data;
          }
        });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Client', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/client-index']);
      });
    } else {
      delete data.id;
      this.service.post('Client', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/client-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/client-index']);
  }
}
