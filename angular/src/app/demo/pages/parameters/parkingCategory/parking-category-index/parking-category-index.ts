import { Component, inject, OnInit, ViewChild } from '@angular/core';
// import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { ParkingCtegory } from '../parking-ctegory';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { RateType } from '../../ratesType/rate-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-parking-category-index',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule,CommonModule, FormsModule],
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

getActiveCategories(): number {
  return this.dataSource.data.filter(c => c.asset && !c.isDeleted).length;
}

getDeletedCategories(): number {
  return this.dataSource.data.filter(c => c.isDeleted).length;
}

getUniqueCodes(): number {
  const uniqueCodes = new Set(this.dataSource.data.filter(c => c.code).map(c => c.code));
  return uniqueCodes.size;
}

isPremiumCategory(category: ParkingCtegory): boolean {
  const premiumCodes = ['VIP', 'PREMIUM', 'EJECUTIVO', 'PLATINUM'];
  return premiumCodes.some(code => category.code?.toUpperCase().includes(code) || category.name?.toUpperCase().includes(code));
}

isVIPCategory(category: ParkingCtegory): boolean {
  return category.code?.toUpperCase() === 'VIP' || category.name?.toUpperCase().includes('VIP');
}

isStandardCategory(category: ParkingCtegory): boolean {
  const standardCodes = ['A', 'B', 'C', 'D', 'E'];
  return standardCodes.includes(category.code?.toUpperCase());
}

getCategoryIcon(category: ParkingCtegory): string {
  if (this.isVIPCategory(category)) return 'star';
  if (this.isPremiumCategory(category)) return 'workspace_premium';
  if (category.code?.toUpperCase() === 'A') return 'looks_one';
  if (category.code?.toUpperCase() === 'B') return 'looks_two';
  if (category.code?.toUpperCase() === 'C') return 'looks_3';
  return 'category';
}

getCategoryIconClass(category: ParkingCtegory): string {
  if (this.isVIPCategory(category)) return 'icon-vip';
  if (this.isPremiumCategory(category)) return 'icon-premium';
  if (this.isStandardCategory(category)) return 'icon-standard';
  return 'icon-general';
}

getCategoryCodeIcon(code: string): string {
  if (!code) return 'tag';
  const upperCode = code.toUpperCase();
  if (upperCode === 'VIP') return 'star';
  if (upperCode.includes('PREMIUM')) return 'workspace_premium';
  if (['A', 'B', 'C', 'D', 'E'].includes(upperCode)) return 'badge';
  return 'qr_code';
}

getCategoryCodeClass(code: string): string {
  if (!code) return 'code-default';
  const upperCode = code.toUpperCase();
  if (upperCode === 'VIP') return 'code-vip';
  if (upperCode.includes('PREMIUM')) return 'code-premium';
  if (upperCode === 'A') return 'code-a';
  if (upperCode === 'B') return 'code-b';
  if (upperCode === 'C') return 'code-c';
  return 'code-standard';
}

getCategoryTypeLabel(category: ParkingCtegory): string {
  if (this.isVIPCategory(category)) return 'VIP';
  if (this.isPremiumCategory(category)) return 'Premium';
  if (this.isStandardCategory(category)) return 'Estándar';
  return 'General';
}

getPriorityIcon(category: ParkingCtegory): string {
  if (this.isVIPCategory(category)) return 'priority_high';
  if (this.isPremiumCategory(category)) return 'star_rate';
  return 'radio_button_unchecked';
}

getPriorityClass(category: ParkingCtegory): string {
  if (this.isVIPCategory(category)) return 'priority-vip';
  if (this.isPremiumCategory(category)) return 'priority-premium';
  return 'priority-standard';
}

getCategoryLevelClass(category: ParkingCtegory): string {
  if (this.isVIPCategory(category)) return 'level-vip';
  if (this.isPremiumCategory(category)) return 'level-premium';
  if (this.isStandardCategory(category)) return 'level-standard';
  return 'level-general';
}
}
