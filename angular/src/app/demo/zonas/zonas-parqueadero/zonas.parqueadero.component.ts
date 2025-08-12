import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';

interface Sector {
  capacity: number;
  occupied: number;
  status: string;
  camera: string;
}

interface Zone {
  name: string;
  capacity: number;
  occupied: number;
  level: number;
  cameras: number;
  status: string;
  sectors: { [key: string]: Sector };
}

interface Camera {
  name: string;
  model: string;
  resolution: string;
  ip: string;
  location: string;
  status: string;
}

@Component({
  selector: 'app-zonas-parqueadero',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './zonas-parqueadero.component.html',
  styleUrl: './zonas-parqueadero.component.scss'
})
export class ZonasParqueadero implements OnInit, OnDestroy {
  
  // Estadísticas del dashboard
  totalZones = 12;
  availableSpaces = 234;
  activeCameras = 18;
  occupancyRate = 68;

  // Filtros
  selectedFilter = 'all';
  searchTerm = '';
  activeTab = 'all';

  // Datos de zonas
  zonesData: { [key: string]: Zone } = {
    'A': {
      name: 'Zona A - Nivel Principal',
      capacity: 45,
      occupied: 32,
      level: 1,
      cameras: 2,
      status: 'active',
      sectors: {
        'A1': { capacity: 28, occupied: 15, status: 'disponible', camera: 'Entrada Principal' },
        'A2': { capacity: 25, occupied: 0, status: 'mantenimiento', camera: 'Lateral Este' }
      }
    },
    'B': {
      name: 'Zona B - Nivel Superior',
      capacity: 60,
      occupied: 51,
      level: 2,
      cameras: 3,
      status: 'active',
      sectors: {
        'B1': { capacity: 30, occupied: 24, status: 'disponible', camera: 'Entrada Oeste' },
        'B2': { capacity: 30, occupied: 27, status: 'ocupacion', camera: 'Salida Oeste' }
      }
    }
  };

  // Datos de cámaras
  camerasData: { [key: string]: Camera } = {
    'CAM001': {
      name: 'Cámara Entrada Principal',
      model: 'XBR-1001',
      resolution: 'HD (1080p)',
      ip: '192.168.0.10',
      location: 'Zona A - Sector A1',
      status: 'online'
    },
    'CAM002': {
      name: 'Cámara Salida Principal',
      model: 'XBR-2002',
      resolution: 'Full HD (1080p)',
      ip: '192.168.0.11',
      location: 'Zona B - Sector B1',
      status: 'online'
    },
    'CAM003': {
      name: 'Cámara Nivel 3',
      model: 'XBR-3003',
      resolution: '4K (2160p)',
      ip: '192.168.0.12',
      location: 'Zona A - Sector A2',
      status: 'offline'
    }
  };

  // Modal data
  modalTitle = '';
  modalContent = '';
  showModal = false;

  private updateInterval: any;

  ngOnInit() {
    console.log('Sistema de gestión de zonas iniciado');
    this.startAutoUpdate();
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  // Métodos de filtrado
  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    console.log('Filtrar por:', filter);
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm.toLowerCase();
    console.log('Buscar:', searchTerm);
  }

  onTabClick(filter: string) {
    this.activeTab = filter;
    console.log('Filtro por tab:', filter);
  }

  // Métodos de acción
  onZoneAction(action: string, zoneId: string) {
    this.showDetailModal('zone', zoneId, action);
  }

  onSectorAction(action: string, sectorId: string) {
    this.showDetailModal('sector', sectorId, action);
  }

  onCameraAction(action: string, cameraId: string) {
    this.showDetailModal('camera', cameraId, action);
  }

  // Método para mostrar modal
  showDetailModal(type: string, id: string, action: string) {
    let content = '';
    let title = '';

    switch (type) {
      case 'zone':
        const zone = this.zonesData[id];
        if (zone) {
          title = `Gestión de ${zone.name}`;
          content = this.generateZoneModalContent(zone);
        }
        break;

      case 'sector':
        title = `Gestión del Sector ${id}`;
        content = this.generateSectorModalContent(id);
        break;

      case 'camera':
        const camera = this.camerasData[id];
        if (camera) {
          title = `Gestión de ${camera.name}`;
          content = this.generateCameraModalContent(camera);
        }
        break;
    }

    this.modalTitle = title;
    this.modalContent = content;
    this.showModal = true;
  }

  private generateZoneModalContent(zone: Zone): string {
    const occupancyPercentage = Math.round((zone.occupied / zone.capacity) * 100);
    return `
      <div class="detail-info">
        <h6>Información General</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <label>Nombre de la Zona</label>
            <input type="text" class="form-control" value="${zone.name}">
          </div>
          <div class="col-md-6">
            <label>Capacidad Total</label>
            <input type="number" class="form-control" value="${zone.capacity}">
          </div>
        </div>
        <h6 class="mt-4">Estadísticas Actuales</h6>
        <div class="stats-grid">
          <div class="stat-item">
            <strong>Ocupación:</strong> ${zone.occupied}/${zone.capacity} (${occupancyPercentage}%)
          </div>
          <div class="stat-item">
            <strong>Espacios Libres:</strong> ${zone.capacity - zone.occupied}
          </div>
          <div class="stat-item">
            <strong>Cámaras:</strong> ${zone.cameras} activas
          </div>
        </div>
      </div>
    `;
  }

  private generateSectorModalContent(sectorId: string): string {
    return `
      <div class="detail-info">
        <h6>Información del Sector</h6>
        <div class="sector-management">
          <p><strong>Capacidad:</strong> 28 espacios</p>
          <p><strong>Ocupados:</strong> 15 espacios</p>
          <p><strong>Disponibles:</strong> 13 espacios</p>
          <p><strong>Estado:</strong> Disponible</p>
          <h6 class="mt-3">Acciones Disponibles</h6>
          <div class="action-buttons">
            <button class="btn btn-success btn-sm">Abrir Sector</button>
            <button class="btn btn-warning btn-sm">Cerrar Sector</button>
            <button class="btn btn-info btn-sm">Ver Historial</button>
            <button class="btn btn-secondary btn-sm">Generar Reporte</button>
          </div>
        </div>
      </div>
    `;
  }

  private generateCameraModalContent(camera: Camera): string {
    return `
      <div class="detail-info">
        <h6>Información de la Cámara</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <label>Nombre</label>
            <input type="text" class="form-control" value="${camera.name}">
          </div>
          <div class="col-md-6">
            <label>Modelo</label>
            <input type="text" class="form-control" value="${camera.model}">
          </div>
        </div>
        <h6 class="mt-4">Estado y Configuración</h6>
        <div class="camera-config">
          <p><strong>Estado:</strong> 
            <span class="badge ${camera.status === 'online' ? 'bg-success' : 'bg-danger'}">
              ${camera.status === 'online' ? 'EN LÍNEA' : 'DESCONECTADA'}
            </span>
          </p>
        </div>
      </div>
    `;
  }

  // Botones principales
  addZone() {
    alert('Funcionalidad: Agregar nueva zona');
  }

  refreshData() {
    alert('Actualizando datos...');
    this.updateStats();
  }

  addCamera() {
    alert('Funcionalidad: Agregar nueva cámara');
  }

  // Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // Actualización automática
  private startAutoUpdate() {
    this.updateInterval = setInterval(() => {
      this.updateStats();
    }, 30000);
  }

  private updateStats() {
    console.log('Actualizando estadísticas...');
    // Aquí puedes implementar la lógica para actualizar las estadísticas
  }

  // Métodos helper para el template
  getZoneKeys(): string[] {
    return Object.keys(this.zonesData);
  }

  getSectorKeys(zoneId: string): string[] {
    return Object.keys(this.zonesData[zoneId]?.sectors || {});
  }

  getCameraKeys(): string[] {
    return Object.keys(this.camerasData);
  }

  calculateOccupancyPercentage(occupied: number, capacity: number): number {
    return Math.round((occupied / capacity) * 100);
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'active':
      case 'disponible':
        return 'bg-success';
      case 'mantenimiento':
        return 'bg-danger';
      case 'ocupacion':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'ACTIVA';
      case 'disponible':
        return 'DISPONIBLE';
      case 'mantenimiento':
        return 'MANTENIMIENTO';
      case 'ocupacion':
        return 'ALTA OCUPACIÓN';
      case 'online':
        return 'EN LÍNEA';
      case 'offline':
        return 'DESCONECTADA';
      default:
        return status.toUpperCase();
    }
  }
}