import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { General } from 'src/app/generic/general.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Role } from '../role';

@Component({
  selector: 'app-role-index',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatIconModule, CommonModule, FormsModule,MatTooltipModule],
  templateUrl: './role-index.html',
  styleUrl: './role-index.scss'
})
export class RoleIndex implements OnInit {
 displayedColumns: string[] = ['name', 'description', 'asset', 'acciones'];

  dataSource = new MatTableDataSource<Role>();

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
    text: 'Esta acción eliminará el rol permanentemente.',
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




}
