import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { RolFormPermission } from '../rol-form-permission';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol-form-per-index',
  imports: [GenericTable],
  templateUrl: './rol-form-per-index.html',
  styleUrl: './rol-form-per-index.scss'
})
export class RolFormPerIndex implements OnInit {
dataSource = new MatTableDataSource<RolFormPermission>();
columns = [
  { key: 'rolName', label: 'Rol' },
  { key: 'permissionName', label: 'Permiso' },
  { key: 'formName', label: 'Formulario' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}
 ngOnInit(): void {
    this.getAllRolFormPermission();
  }

 getAllRolFormPermission(): void {
  this._generalService.get<{ data: RolFormPermission[] }>('RolFormPermission/join').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/rolFormPermission-form']);
}

goToEdit(form: RolFormPermission): void {
  this.router.navigate(['/rolFormPermission-form', form.id]);
}


deleteModule(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el registro.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('RolFormPermission', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
        this.getAllRolFormPermission();
      });
    }
  });
}

deletePermanentModule(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el registro permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('RolFormPermission/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado permanentemente.', 'success');
        this.getAllRolFormPermission();
      });
    }
  });
}
}
