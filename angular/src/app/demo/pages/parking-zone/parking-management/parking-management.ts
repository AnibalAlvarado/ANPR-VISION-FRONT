/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Zones } from '../../parameters/zones/zones';
import { General } from 'src/app/generic/general.service';
import { Sectors } from '../../parameters/sectors/sectors';
import { Slots } from '../../parameters/slots/slots';



@Component({
  selector: 'app-parking-management',
  imports: [
   MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatInputModule,
    FormsModule,
    CommonModule
],
  templateUrl: './parking-management.html',
  styleUrl: './parking-management.scss'
})
export class ParkingManagement implements OnInit {
 zones: Zones[] = [];
  sectors: Sectors[] = [];
  slots: Slots[] = [];
  vehicleData: any = null;

  selectedZone: Zones | null = null;
  filteredSectors: Sectors[] = [];
  selectedSector: Sectors | null = null;
  filteredSlots: Slots[] = [];

  selectedSlot: Slots | null = null;
  showSectorModal = false;
  searchTerm = '';

  constructor(private _generalService: General) {}

  ngOnInit() {
    this.getAllZones();
    this.getAllSectors();
    this.getAllSlots();
  }

  // --- ZONES ---
  getAllZones(): void {
    this._generalService.get<{ data: Zones[] }>('Zones/join')
      .subscribe({
        next: (res) => {
          this.zones = res.data;
          if (this.zones.length > 0) {
            this.selectZone(this.zones[0]);
          }
        },
        error: (err) => console.error('Error al obtener zonas:', err)
      });
  }

  // --- SECTORS ---
  getAllSectors(): void {
    this._generalService.get<{ data: Sectors[] }>('Sectors/join')
      .subscribe({
        next: (res) => {
          this.sectors = res.data;
          this.filterSectors();
        },
        error: (err) => console.error('Error al obtener sectores:', err)
      });
  }

  // --- SLOTS ---
  getAllSlots(): void {
    this._generalService.get<{ data: Slots[] }>('Slots/join')
      .subscribe({
        next: (res) => {
          this.slots = res.data;
          this.filterSlots();
        },
        error: (err) => console.error('Error al obtener slots:', err)
      });
  }

  // --- FILTROS ---
  selectZone(zone: Zones): void {
    this.selectedZone = zone;
    this.filterSectors();
    this.selectedSector = null;
    this.filteredSlots = [];
  }

  filterSectors(): void {
    if (this.selectedZone) {
      this.filteredSectors = this.sectors.filter(s => s.zonesId === this.selectedZone!.id);
    } else {
      this.filteredSectors = [];
    }
  }

  openSectorModal(sector: Sectors): void {
    this.selectedSector = sector;
    this.filterSlots();
    this.showSectorModal = true;
    this.selectedSlot = null;
  }

  closeSectorModal(): void {
    this.showSectorModal = false;
    this.selectedSector = null;
    this.filteredSlots = [];
    this.selectedSlot = null;
  }

  filterSlots(): void {
    if (this.selectedSector) {
      this.filteredSlots = this.slots.filter(s => s.sectorsId === this.selectedSector!.id);
    } else {
      this.filteredSlots = [];
    }
  }

  // --- SLOT SELECCIÓN ---
selectSlot(slot: any): void {
  this.selectedSlot = slot;
  this.vehicleData = null; // limpiar antes de cargar nueva info

  if (!slot.isAvailable) {
    this.loadVehicleData(slot.id);
  }
}
// Consulta al backend para traer la info del vehículo en el slot
loadVehicleData(slotId: number): void {
  this._generalService.get<any>(`Vehicle/slot/${slotId}`).subscribe({
    next: (response) => {
      this.vehicleData = response;

      if (this.vehicleData?.vehicleId) {
        // Segunda llamada para obtener la placa y demás info
        this._generalService.get<any>(`Vehicle/${this.vehicleData.vehicleId}`).subscribe({
          next: (vehicle) => {
            this.vehicleData.vehicle = vehicle; // guardamos los datos completos
          },
          error: (err) => {
            console.error("Error cargando datos del vehículo", err);
          }
        });
      }
    },
    error: (err) => {
      console.error("Error cargando info de slot", err);
    }
  });
}

  // --- UTILIDADES ---
  getStatusColor(status: string): string {
    switch (status) {
      case 'libre': return '#10B981'; // verde
      case 'ocupado': return '#EF4444'; // rojo
      case 'reservado': return '#F59E0B'; // amarillo
      case 'mantenimiento': return '#6B7280'; // gris
      default: return '#6B7280';
    }
  }

  getSectorStatusCount(status: string, sector: Sectors): number {
    const slotsSector = this.slots.filter(s => s.sectorsId === sector.id);
    return slotsSector.filter((slot: any) => {
      if (status === 'libre') return slot.isAvailable;
      if (status === 'ocupado') return !slot.isAvailable; // ejemplo: ocupado = no disponible
      // aquí puedes mapear reservado/mantenimiento si backend lo trae
      return false;
    }).length;
  }

  getAvailableSlots(sector: Sectors): number {
    return this.slots.filter(s => s.sectorsId === sector.id && s.isAvailable).length;
  }

  getTotalSectorSlots(sector: Sectors): number {
    return this.slots.filter(s => s.sectorsId === sector.id).length;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'libre': 'Disponible',
      'ocupado': 'Ocupado',
      'reservado': 'Reservado',
      'mantenimiento': 'En Mantenimiento'
    };
    return statusMap[status] || status;
  }


}
