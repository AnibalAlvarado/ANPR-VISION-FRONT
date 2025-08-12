import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { RateType } from '../rate-type';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rate-type-index',
  imports: [GenericTable],
  templateUrl: './rate-type-index.html',
  styleUrl: './rate-type-index.scss'
})
export class RateTypeIndex implements OnInit {
dataSource = new MatTableDataSource<RateType>();
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
    this.getAllTypeRates();
  }

 getAllTypeRates(): void {
  this._generalService.get<{ data: RateType[] }>('RatesType/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/RatesType-form']);
}

goToEdit(RatesType: RateType): void {
  this.router.navigate(['/RatesType-form', RatesType.id]);
}


deleteTypeVehicle(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el tipo de tarifa.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('RatesType', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El tipo de tarifa ha sido eliminado.', 'success');
        this.getAllTypeRates();
      });
    }
  });
}

deletePermanentTypeVehicle(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el tipo de tarifa permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('RatesType/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El tipo de tarifa ha sido eliminado permanentemente.', 'success');
        this.getAllTypeRates();
      });
    }
  });
}
}
