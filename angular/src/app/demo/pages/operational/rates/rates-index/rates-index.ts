import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { General } from 'src/app/generic/general.service';
import { Rates } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rates-index',
  imports: [GenericTable],
  templateUrl: './rates-index.html',
  styleUrl: './rates-index.scss'
})
export class RatesIndex implements OnInit {
dataSource = new MatTableDataSource<Rates>();
columns = [
 { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'amount', label: 'Cantidad' },
  { key: 'starHour', label: 'Hora de Inicio' },
  { key: 'endHour', label: 'Hora de Fin' },
  { key: 'year', label: 'Año' },
    { key: 'ratesType', label: 'Tipo de Tarifa' },
  { key: 'typeVehicle', label: 'Tipo de Vehículo' },
  { key: 'parking', label: 'Parqueadero' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}
 ngOnInit(): void {
    this.getAllMemberShips();
  }

 getAllMemberShips(): void {
  this._generalService.get<{ data: Rates[] }>('Rates/join').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/rates-form']);
}

goToEdit(form: Rates): void {
  this.router.navigate(['/rates-form', form.id]);
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
      this._generalService.delete('Rates', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
        this.getAllMemberShips();
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
      this._generalService.delete('Rates/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado permanentemente.', 'success');
        this.getAllMemberShips();
      });
    }
  });
}
}
