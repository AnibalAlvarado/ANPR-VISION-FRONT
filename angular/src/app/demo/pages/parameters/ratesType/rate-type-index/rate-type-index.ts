import { Component, inject, OnInit, ViewChild } from '@angular/core';
// import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { RateType } from '../rate-type';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rate-type-index',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule,CommonModule, FormsModule, ],
  templateUrl: './rate-type-index.html',
  styleUrl: './rate-type-index.scss'
})
export class RateTypeIndex implements OnInit {
dataSource = new MatTableDataSource<RateType>();
originalData: RateType[] = [];
  selectedFilter: string = 'all';
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
    this.originalData = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/RatesType-form']);
}

goToEdit(RatesType: RateType): void {
  this.router.navigate(['/RatesType-form', RatesType.id]);
}


deleteRateType(id: number): void {
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

deletePermanentRateType(id: number): void {
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

// Funciones para las estadísticas del header
  getTotalRateTypes(): number {
    return this.originalData.length;
  }

  getActiveRateTypes(): number {
    return this.originalData.filter(rateType => rateType.asset && !rateType.isDeleted).length;
  }

  getDeletedRateTypes(): number {
    return this.originalData.filter(rateType => rateType.isDeleted).length;
  }

  // Función para aplicar filtro de búsqueda
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    let filteredData = this.originalData;

    // Aplicar filtro de búsqueda
    if (filterValue) {
      filteredData = filteredData.filter(rateType =>
        rateType.name?.toLowerCase().includes(filterValue) ||
        rateType.description?.toLowerCase().includes(filterValue)
      );
    }

    // Aplicar filtro de estado si hay uno activo
    filteredData = this.applyStatusFilter(filteredData);

    this.dataSource.data = filteredData;
  }

  // Función para filtrar por estado
  filterByStatus(status: string): void {
    this.selectedFilter = status;

    // Obtener el valor actual del input de búsqueda
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';

    let filteredData = this.originalData;

    // Aplicar filtro de búsqueda primero si existe
    if (searchValue) {
      filteredData = filteredData.filter(rateType =>
        rateType.name?.toLowerCase().includes(searchValue) ||
        rateType.description?.toLowerCase().includes(searchValue)
      );
    }

    // Aplicar filtro de estado
    filteredData = this.applyStatusFilter(filteredData);

    this.dataSource.data = filteredData;
  }

  // Función auxiliar para aplicar filtro de estado
  private applyStatusFilter(data: RateType[]): RateType[] {
    switch (this.selectedFilter) {
      case 'active':
        return data.filter(rateType => rateType.asset && !rateType.isDeleted);
      case 'inactive':
        return data.filter(rateType => !rateType.asset && !rateType.isDeleted);
      case 'deleted':
        return data.filter(rateType => rateType.isDeleted);
      case 'all':
      default:
        return data;
    }
  }
}
