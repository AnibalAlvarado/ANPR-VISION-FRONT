import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { General } from 'src/app/generic/general.service';
import { Client } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-index',
  imports: [GenericTable],
  templateUrl: './client-index.html',
  styleUrl: './client-index.scss'
})
export class ClientIndex implements OnInit {
dataSource = new MatTableDataSource<Client>();
columns = [
  { key: 'name', label: 'Nombres' },
  { key: 'person', label: 'Nombre del la persona' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}
 ngOnInit(): void {
    this.getAllClients();
  }

 getAllClients(): void {
  this._generalService.get<{ data: Client[] }>('Client/join').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/client-form']);
}

goToEdit(form: Client): void {
  this.router.navigate(['/client-form', form.id]);
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
      this._generalService.delete('Client', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
        this.getAllClients();
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
      this._generalService.delete('Client/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado permanentemente.', 'success');
        this.getAllClients();
      });
    }
  });
}
}
