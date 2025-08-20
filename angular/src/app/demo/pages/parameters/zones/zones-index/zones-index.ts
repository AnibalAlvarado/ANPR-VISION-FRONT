import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Zones } from '../zones';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-zones-index',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, CommonModule, FormsModule,MatPaginator],
  templateUrl: './zones-index.html',
  styleUrl: './zones-index.scss'
})
export class ZonesIndex implements OnInit {
  dataSource = new MatTableDataSource<Zones>();
  originalData: Zones[] = [];
  selectedFilter: string = 'all';

  columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'parking', label: 'Nombre del Parqueadero' },
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
      this.originalData = response.data;
      this.dataSource.data = response.data;
      this.dataSource.paginator = this.paginator;
    });
  }

  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

  //   if (!filterValue) {
  //     this.dataSource.data = this.originalData;
  //     return;
  //   }

  //   this.dataSource.data = this.originalData.filter(zone =>
  //     zone.name?.toLowerCase().includes(filterValue) ||
  //     zone.parking?.toLowerCase().includes(filterValue)
  //   );
  // }

  goToCreate(): void {
    this.router.navigate(['/Zones-form']);
  }

  goToEdit(form: Zones): void {
    this.router.navigate(['/Zones-form', form.id]);
  }

  deleteZone(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro lógicamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      background: '#fff',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this._generalService.delete('Zones', id).subscribe(() => {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El registro ha sido eliminado lógicamente.',
            icon: 'success',
            confirmButtonColor: '#4caf50',
            customClass: {
              popup: 'swal-popup',
              title: 'swal-title',
              confirmButton: 'swal-success-btn'
            }
          });
          this.getAllZones();
        });
      }
    });
  }

  deletePermanentZone(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro permanentemente. Esta acción NO se puede deshacer.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar permanentemente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ff5722',
      cancelButtonColor: '#3085d6',
      background: '#fff',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-danger-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this._generalService.delete('Zones/permanent', id).subscribe(() => {
          Swal.fire({
            title: '¡Eliminado permanentemente!',
            text: 'El registro ha sido eliminado permanentemente.',
            icon: 'success',
            confirmButtonColor: '#4caf50',
            customClass: {
              popup: 'swal-popup',
              title: 'swal-title',
              confirmButton: 'swal-success-btn'
            }
          });
          this.getAllZones();
        });
      }
    });
  }

// Funciones para las estadísticas del header
  getTotalZones(): number {
    return this.originalData.length;
  }

  getActiveZones(): number {
    return this.originalData.filter(zone => zone.asset && !zone.isDeleted).length;
  }

  getDeletedZones(): number {
    return this.originalData.filter(zone => zone.isDeleted).length;
  }

  // Función para aplicar filtro de búsqueda
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    let filteredData = this.originalData;

    // Aplicar filtro de búsqueda
    if (filterValue) {
      filteredData = filteredData.filter(zone =>
        zone.name?.toLowerCase().includes(filterValue) ||
        zone.parking?.toLowerCase().includes(filterValue)
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
      filteredData = filteredData.filter(zone =>
        zone.name?.toLowerCase().includes(searchValue) ||
        zone.parking?.toLowerCase().includes(searchValue)
      );
    }

    // Aplicar filtro de estado
    filteredData = this.applyStatusFilter(filteredData);

    this.dataSource.data = filteredData;
  }

   // Función auxiliar para aplicar filtro de estado
  private applyStatusFilter(data: Zones[]): Zones[] {
    switch (this.selectedFilter) {
      case 'active':
        return data.filter(zone => zone.asset && !zone.isDeleted);
      case 'inactive':
        return data.filter(zone => !zone.asset && !zone.isDeleted);
      case 'deleted':
        return data.filter(zone => zone.isDeleted);
      case 'all':
      default:
        return data;
    }
  }
}
