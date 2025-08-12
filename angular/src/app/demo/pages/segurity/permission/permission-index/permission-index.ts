import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { Permission } from '../permission';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permission-index',
  imports: [GenericTable],
  templateUrl: './permission-index.html',
  styleUrl: './permission-index.scss'
})
export class PermissionIndex implements OnInit {
dataSource = new MatTableDataSource<Permission>();
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
    this.getAllPermissions();
  }

 getAllPermissions(): void {
  this._generalService.get<{ data: Permission[] }>('Permission/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/permission-form']);
}

goToEdit(permission: Permission): void {
  this.router.navigate(['/permission-form', permission.id]);
}


deleteModule(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el permiso.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('Permission', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El permiso ha sido eliminado.', 'success');
        this.getAllPermissions();
      });
    }
  });
}

deletePermanentModule(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el permiso permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('Permission/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El permiso ha sido eliminado permanentemente.', 'success');
        this.getAllPermissions();
      });
    }
  });
}
}
