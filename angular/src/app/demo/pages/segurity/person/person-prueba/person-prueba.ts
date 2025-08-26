/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import { Person } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person-prueba',
  imports: [GenericForm],
  templateUrl: './person-prueba.html',
  styleUrl: './person-prueba.scss'
})
export class PersonPrueba implements OnInit {
  formConfig: FieldConfig[] = [
    {
      name: 'firstName',
      label: 'Nombre',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El nombre es obligatorio.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 2, message: 'El nombre debe tener al menos 2 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 50, message: 'El nombre no puede exceder los 50 caracteres.' }
      ]
    },
    {
      name: 'lastName',
      label: 'Apellido',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El apellido es obligatorio.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 2, message: 'El apellido debe tener al menos 2 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 50, message: 'El apellido no puede exceder los 50 caracteres.' }
      ]
    },
    {
      name: 'phoneNumber',
      label: 'Teléfono',
      type: 'tel',
      validations: [
        { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^[0-9]{7,15}$', message: 'El teléfono debe tener entre 7 y 15 dígitos.' }
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

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: Person }>('Person', id).subscribe(response => {
        if (response.success) {
          this.initialData = response.data;
        }
      });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Person', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/persons-index']);
      });
    } else {
      delete data.id;
      this.service.post('Person', data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        this.route.navigate(['/persons-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/persons-index']);
  }
}
