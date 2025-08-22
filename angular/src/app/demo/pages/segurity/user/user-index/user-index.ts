import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { General } from 'src/app/generic/general.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { User } from 'src/app/generic/Models/Entitys';
@Component({
  selector: 'app-user-index',
  imports: [GenericTable],
  templateUrl: './user-index.html',
  styleUrl: './user-index.scss'
})
export class UserIndex implements OnInit {
 dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


columns = [
  { key: 'userName', label: 'Nombre de Usuario' },
  { key: 'email', label: 'Email' },
  { key: 'personName', label: 'Persona' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];

  private _generalService = inject(General);
  private router = inject(Router);

    ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
  this._generalService.get<{ data: User[] }>('User/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}



goToCreate(): void {
  this.router.navigate(['/user-form']);
}
goToEdit(user: User): void {
  this.router.navigate(['/user-form', user.id]);
}


deleteUser(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el usuario.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('User', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El usuario se ha sido eliminado.', 'success');
        this.getAllUsers();
      });
    }
  });
}

deletePermanentUser(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el usuario permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('User/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El usuario se ha sido eliminado permanentemente.', 'success');
        this.getAllUsers();
      });
    }
  });
}
}
