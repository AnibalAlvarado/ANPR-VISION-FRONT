import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { ParkingCtegory } from '../parking-ctegory';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { RateType } from '../../ratesType/rate-type';

@Component({
  selector: 'app-parking-category-index',
  imports: [GenericTable],
  templateUrl: './parking-category-index.html',
  styleUrl: './parking-category-index.scss'
})
export class ParkingCategoryIndex implements OnInit {
dataSource = new MatTableDataSource<ParkingCtegory>();
columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'code', label: 'Código' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}
 ngOnInit(): void {
    this.getAllTypeRates();
  }

 getAllTypeRates(): void {
  this._generalService.get<{ data: ParkingCtegory[] }>('ParkingCategory/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/ParkingCategory-form']);
}

goToEdit(RatesType: RateType): void {
  this.router.navigate(['/ParkingCategory-form', RatesType.id]);
}


deleteTypeVehicle(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la categoría del parqueadero.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('ParkingCategory', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'La categoría del parqueadero ha sido eliminado.', 'success');
        this.getAllTypeRates();
      });
    }
  });
}

deletePermanentTypeVehicle(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la categoría del parqueadero permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('ParkingCategory/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'La categoría del parqueadero ha sido eliminado permanentemente.', 'success');
        this.getAllTypeRates();
      });
    }
  });
}
}
