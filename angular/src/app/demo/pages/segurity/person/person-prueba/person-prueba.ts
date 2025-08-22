/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Person } from '../person';

@Component({
  selector: 'app-person-prueba',
  imports: [GenericForm],
  templateUrl: './person-prueba.html',
  styleUrl: './person-prueba.scss'
})
export class PersonPrueba implements OnInit {
 formConfig: FieldConfig[] = [
    { name: 'firstName', label: 'Nombre', type: 'text', required: true },
    { name: 'lastName', label: 'Apellido', type: 'text', required: true },
    { name: 'phoneNumber', label: 'Teléfono', type: 'tel' },
    { name: 'asset', label: 'Activo', type: 'toggle' }
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
        Swal.fire({ icon: 'success', title: 'Actualizado', timer: 2000 });
        this.route.navigate(['/persons-index']);
      });
    } else {
      delete data.id;
      this.service.post('Person', data).subscribe(() => {
        Swal.fire({ icon: 'success', title: 'Creado', timer: 2000 });
        this.route.navigate(['/persons-index']);
      });
    }
  }

  cancel() {
    this.route.navigate(['/persons-index']);
  }
}
