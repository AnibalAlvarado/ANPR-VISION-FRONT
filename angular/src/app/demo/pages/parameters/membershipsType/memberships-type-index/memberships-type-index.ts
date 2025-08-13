import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
// import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { MembershipsType } from '../memberships-type';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-memberships-type-index',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule,CommonModule, FormsModule, ],
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

getActiveMemberships(): number {
  return this.dataSource.data.filter(m => m.asset && !m.isDeleted).length;
}

getDeletedMemberships(): number {
  return this.dataSource.data.filter(m => m.isDeleted).length;
}

getTotalRevenue(): number {
  return this.dataSource.data
    .filter(m => m.asset && !m.isDeleted)
    .reduce((total, m) => total + m.price, 0);
}

getDailyRate(membership: MembershipsType): number {
  return membership.duration > 0 ? membership.price / membership.duration : 0;
}

isPremiumPlan(membership: MembershipsType): boolean {
  return membership.price > 100 || membership.duration > 365;
}

isBasicPlan(membership: MembershipsType): boolean {
  return membership.price <= 50 && membership.duration <= 30;
}

getMembershipIcon(membership: MembershipsType): string {
  if (this.isPremiumPlan(membership)) return 'workspace_premium';
  if (this.isBasicPlan(membership)) return 'card_membership';
  if (membership.duration > 180) return 'verified';
  return 'local_offer';
}

getMembershipIconClass(membership: MembershipsType): string {
  if (this.isPremiumPlan(membership)) return 'icon-premium';
  if (this.isBasicPlan(membership)) return 'icon-basic';
  if (membership.duration > 180) return 'icon-standard';
  return 'icon-offer';
}
}
