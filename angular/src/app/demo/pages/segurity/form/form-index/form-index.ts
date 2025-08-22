import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { General } from 'src/app/generic/general.service';
import { Form } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';
// import { Form } from '../form';

@Component({
  selector: 'app-form-index',
  imports: [GenericTable],
  templateUrl: './form-index.html',
  styleUrl: './form-index.scss'
})
export class FormIndex implements OnInit {
dataSource = new MatTableDataSource<Form>();
columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}
 ngOnInit(): void {
    this.getAllForms();
  }

 getAllForms(): void {
  this._generalService.get<{ data: Form[] }>('Form/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/form-form']);
}

goToEdit(form: Form): void {
  this.router.navigate(['/form-form', form.id]);
}


deleteModule(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el formulario.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('Form', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El formulario ha sido eliminado.', 'success');
        this.getAllForms();
      });
    }
  });
}

deletePermanentModule(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el formulario permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('Form/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El formulario ha sido eliminado permanentemente.', 'success');
        this.getAllForms();
      });
    }
  });
}
}
