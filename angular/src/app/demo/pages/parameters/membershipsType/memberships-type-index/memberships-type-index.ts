import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { MembershipsType } from '../memberships-type';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-memberships-type-index',
  imports: [GenericTable],
  templateUrl: './memberships-type-index.html',
  styleUrl: './memberships-type-index.scss'
})
export class MembershipsTypeIndex implements OnInit {
dataSource = new MatTableDataSource<MembershipsType>();
columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'description', label: 'Descripción' },
  { key: 'duration', label: 'Duración(días)' },
  { key: 'price', label: 'Precio' },
  { key: 'asset', label: 'Estado' },
  { key: 'isDeleted', label: 'Eliminado Lógicamente' }
];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}
 ngOnInit(): void {
    this.getAllForms();
  }

 getAllForms(): void {
  this._generalService.get<{ data: MembershipsType[] }>('MemberShipType/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/memberShipType-form']);
}

goToEdit(form: MembershipsType): void {
  this.router.navigate(['/memberShipType-form', form.id]);
}


deleteModule(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el tipo de membresía.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('MemberShipType', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El tipo de membresía ha sido eliminado.', 'success');
        this.getAllForms();
      });
    }
  });
}

deletePermanentModule(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el tipo de membresía permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('MemberShipType/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El tipo de membresía ha sido eliminado permanentemente.', 'success');
        this.getAllForms();
      });
    }
  });
}
}
