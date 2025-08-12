import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { VehicleType } from '../vehicle-type';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-type-index',
  imports: [GenericTable],
  templateUrl: './vehicle-type-index.html',
  styleUrl: './vehicle-type-index.scss'
})
export class VehicleTypeIndex implements OnInit {
dataSource = new MatTableDataSource<VehicleType>();
columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}
 ngOnInit(): void {
    this.getAllTypeVehicle();
  }

 getAllTypeVehicle(): void {
  this._generalService.get<{ data: VehicleType[] }>('TypeVehicle/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/TypeVehicle-form']);
}

goToEdit(TypeVehicle: VehicleType): void {
  this.router.navigate(['/TypeVehicle-form', TypeVehicle.id]);
}


deleteTypeVehicle(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el tipo de vehículo.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('TypeVehicle', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El vehículo ha sido eliminado.', 'success');
        this.getAllTypeVehicle();
      });
    }
  });
}

deletePermanentTypeVehicle(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el tipo de vehículo permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('TypeVehicle/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El tipo de vehículo ha sido eliminado permanentemente.', 'success');
        this.getAllTypeVehicle();
      });
    }
  });
}
}
