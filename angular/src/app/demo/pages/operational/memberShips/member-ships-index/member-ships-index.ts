import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { General } from 'src/app/generic/general.service';
import { MemberShips } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-member-ships-index',
  imports: [GenericTable],
  templateUrl: './member-ships-index.html',
  styleUrl: './member-ships-index.scss'
})
export class MemberShipsIndex implements OnInit {
dataSource = new MatTableDataSource<MemberShips>();
columns = [
  { key: 'startDate', label: 'Fecha de Inicio' },
  { key: 'endDate', label: 'Fecha de Fin' },
  { key: 'priceAtPurchase', label: 'Precio al Comprar' },
  { key: 'durationDays', label: 'Duración' },
  { key: 'currency', label: 'Moneda' },
  { key: 'membershipType', label: 'Tipo de Membresía' },
  { key: 'vehicle', label: 'Vehículo' },
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
  this._generalService.get<{ data: MemberShips[] }>('MemberShips/join').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/memberShips-form']);
}

goToEdit(form: MemberShips): void {
  this.router.navigate(['/memberShips-form', form.id]);
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
      this._generalService.delete('MemberShips', id).subscribe(() => {
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
      this._generalService.delete('MemberShips/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado permanentemente.', 'success');
        this.getAllMemberShips();
      });
    }
  });
}
}
