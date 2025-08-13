import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Zones } from '../zones';

@Component({
  selector: 'app-zones-index',
  imports: [GenericTable],
  templateUrl: './zones-index.html',
  styleUrl: './zones-index.scss'
})
export class ZonesIndex implements OnInit {
dataSource = new MatTableDataSource<Zones>();
columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'parkingName', label: 'Nombre del Parqueadero' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}
 ngOnInit(): void {
    this.getAllZones();
  }

 getAllZones(): void {
  this._generalService.get<{ data: Zones[] }>('Zones/join').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/Zones-form']);
}

goToEdit(form: Zones): void {
  this.router.navigate(['/Zones-form', form.id]);
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
      this._generalService.delete('Zones', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
        this.getAllZones();
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
      this._generalService.delete('Zones/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado permanentemente.', 'success');
        this.getAllZones();
      });
    }
  });
}
}
