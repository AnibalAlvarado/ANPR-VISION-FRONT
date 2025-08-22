import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { General } from 'src/app/generic/general.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Role } from 'src/app/generic/Models/Entitys';

@Component({
  selector: 'app-role-prueba',
  imports: [GenericTable],
  templateUrl: './role-index.html',
  styleUrl: './role-index.scss'
})
export class RoleIndex implements OnInit {
dataSource = new MatTableDataSource<Role>();
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
    this.getAllRoles();
  }

 getAllRoles(): void {
  this._generalService.get<{ data: Role[] }>('Rol/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/role-form']);
}

goToEdit(role: Role): void {
  this.router.navigate(['/role-form', role.id]);
}


deleteRole(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el rol.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('Rol', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El rol ha sido eliminado.', 'success');
        this.getAllRoles();
      });
    }
  });
}

deletePermanentRole(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el rol permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('Rol/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El rol ha sido eliminado permanentemente.', 'success');
        this.getAllRoles();
      });
    }
  });
}

}
