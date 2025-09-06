import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {  MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import { RegisteredVehicle } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registered-vehicle-index',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule,CommonModule, FormsModule],
  templateUrl: './registered-vehicle-index.html',
  styleUrl: './registered-vehicle-index.scss'
})
export class RegisteredVehicleIndex implements OnInit {
dataSource = new MatTableDataSource<RegisteredVehicle>();
  originalData: RegisteredVehicle[] = [];
  selectedFilter: string = 'all';
  columns = [
    { key: 'entryDate', label: 'Fecha de Entrada' },
    { key: 'exitDate', label: 'Fecha de Salida' },
    { key: 'vehicle', label: 'Vehículo' },
    { key: 'slots', label: 'Slot' },
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
    this._generalService.get<{ data: RegisteredVehicle[] }>('RegisteredVehicles/join').subscribe(response => {
      this.dataSource.data = response.data;
      this.originalData = response.data;
      this.dataSource.paginator = this.paginator;
    });
  }

  goToCreate(): void {
    this.router.navigate(['/registeredVehicle-form']);
  }

  goToEdit(form: RegisteredVehicle): void {
    this.router.navigate(['/registeredVehicle-form', form.id]);
  }

  deleteRegisteredVehicle(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro de vehículo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this._generalService.delete('RegisteredVehicles', id).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El registro de vehículo ha sido eliminado.', 'success');
          this.getAllForms();
        });
      }
    });
  }

  deletePermanentRegisteredVehicle(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro de vehículo permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this._generalService.delete('RegisteredVehicles/permanent', id).subscribe(() => {
          Swal.fire('¡Eliminado!', 'El registro de vehículo ha sido eliminado permanentemente.', 'success');
          this.getAllForms();
        });
      }
    });
  }

  // Funciones para las estadísticas del header
  getTotalRegisteredVehicles(): number {
    return this.originalData.length;
  }

  getActiveRegisteredVehicles(): number {
    return this.originalData.filter(registeredVehicle => registeredVehicle.asset && !registeredVehicle.isDeleted).length;
  }

  getDeletedRegisteredVehicles(): number {
    return this.originalData.filter(registeredVehicle => registeredVehicle.isDeleted).length;
  }

  // Función para aplicar filtro de búsqueda
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    let filteredData = this.originalData;

    // Aplicar filtro de búsqueda
    if (filterValue) {
      filteredData = filteredData.filter(registeredVehicle =>
        registeredVehicle.vehicle?.toLowerCase().includes(filterValue) ||
        registeredVehicle.slots?.toLowerCase().includes(filterValue)
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
      filteredData = filteredData.filter(registeredVehicle =>
        registeredVehicle.vehicle?.toLowerCase().includes(searchValue) ||
        registeredVehicle.slots?.toLowerCase().includes(searchValue)
      );
    }

    // Aplicar filtro de estado
    filteredData = this.applyStatusFilter(filteredData);

    this.dataSource.data = filteredData;
  }

  // Función auxiliar para aplicar filtro de estado
  private applyStatusFilter(data: RegisteredVehicle[]): RegisteredVehicle[] {
    switch (this.selectedFilter) {
      case 'active':
        return data.filter(registeredVehicle => registeredVehicle.asset && !registeredVehicle.isDeleted);
      case 'inactive':
        return data.filter(registeredVehicle => !registeredVehicle.asset && !registeredVehicle.isDeleted);
      case 'deleted':
        return data.filter(registeredVehicle => registeredVehicle.isDeleted);
      case 'all':
      default:
        return data;
    }
  }
}
