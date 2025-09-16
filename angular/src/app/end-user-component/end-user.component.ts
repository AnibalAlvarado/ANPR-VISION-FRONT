import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';

/* ===== Modelos de datos (ajusta si tu backend usa otros nombres) ===== */
export interface UserSummary {
  id?: number | string;
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface ParkingInfo {
  id?: number | string;
  name?: string;
  address?: string;
  hours?: string;
  phone?: string;
}

export interface VehicleInfo {
  id?: number | string;
  plate?: string;
  type?: string;   // 'Carro' | 'Moto' | ...
  brand?: string;
  model?: string;
  color?: string;
}

export interface MembershipInfo {
  id?: number | string;
  name?: string;
  active?: boolean;
  startDate?: string | Date;
  endDate?: string | Date;
  remainingDays?: number;
  benefits?: string[];
}

export interface StayInfo {
  zoneName?: string;
  sectorName?: string;
  slotCode?: string;
  since?: string | Date;
  elapsedMinutes?: number;
  estimatedCost?: number;
}

export interface TariffInfo {
  id?: number | string;
  name?: string;
  description?: string;
  price?: number;        // fijo
  pricePerHour?: number; // por hora (opcional)
}

export interface HistoryEvent {
  id?: number | string;
  icon?: string;   // nombre del mat-icon, ej: 'payments'
  title?: string;
  desc?: string;
  at?: string | Date;
  amount?: number | null;
}

/* ================= Componente ================= */
@Component({
  selector: 'app-end-user.component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatSidenavModule,
  ],
  templateUrl: './end-user.component.html',
  styleUrls: ['./end-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,       
  host: { class: 'end-user-scope' }            
})
export class endUserComponent {
  /* Entradas que usa tu HTML */
  @Input() user?: UserSummary | null;
  @Input() parking?: ParkingInfo | null;
  @Input() vehicle?: VehicleInfo | null;
  @Input() membership?: MembershipInfo | null;
  @Input() currentStay?: StayInfo | null;
  @Input() balance: number | null = null;

  @Input() tariffs: TariffInfo[] = [];
  @Input() history: HistoryEvent[] = [];

  @Input() helpText?: string | null;

  /* Eventos hacia el padre (opcional si quieres manejar acciones) */
  @Output() payNow = new EventEmitter<void>();
  @Output() seeHistory = new EventEmitter<void>();
  @Output() requestExit = new EventEmitter<void>();

  
  /* ===== Drawer lateral ===== */
  selectedPanel: 'parking' | 'vehicle' | 'membership' | 'location' | 'tariffs' | 'actions' | 'history' | null = null;
  drawerTitle = 'Detalles';
  drawerIcon = 'info';

  @ViewChild('detailDrawer') drawer!: MatDrawer;

  openPanel(type: typeof this.selectedPanel) {
    this.selectedPanel = type;

    const map: Record<string, { title: string; icon: string }> = {
      parking:   { title: 'Parqueadero',        icon: 'apartment' },
      vehicle:   { title: 'Mi vehículo',        icon: 'directions_car' },
      membership:{ title: 'Membresía',          icon: 'card_membership' },
      location:  { title: 'Ubicación actual',   icon: 'map' },
      tariffs:   { title: 'Tarifas',            icon: 'receipt_long' },
      actions:   { title: 'Acciones',           icon: 'bolt' },
      history:   { title: 'Actividad reciente', icon: 'history' },
    };

    const meta = type ? map[type] : undefined;
    this.drawerTitle = meta?.title ?? 'Detalles';
    this.drawerIcon  = meta?.icon  ?? 'info';

    this.drawer?.open();
  }

  closePanel() {
    this.drawer?.close();
    this.selectedPanel = null;
  }

  /* Métodos llamados por tu template */
  onPayNow(): void { this.payNow.emit(); }
  onSeeHistory(): void { this.seeHistory.emit(); }
  onRequestExit(): void { this.requestExit.emit(); }

  /* trackBy opcional para listas grandes (si decides usarlo en el HTML) */
  trackById(_i: number, item: { id?: number | string }): number | string | undefined {
    return item?.id;
  }
  trackByIndex(i: number): number { return i; }
}
