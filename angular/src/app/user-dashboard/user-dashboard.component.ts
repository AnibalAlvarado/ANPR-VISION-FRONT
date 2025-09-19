// src/app/user-dashboard/user-dashboard.component.ts
import { Component, HostListener, OnInit, ViewEncapsulation  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Vehicle { plate: string; type: string; }
interface Membership { status: string; expiration: Date; }
interface Payment { id?: string|number; date?: string|Date; description: string; amount: number; }
interface Tariff { id?: string|number; description: string; amount: number; when?: string|Date; }
interface LocationInfo { zone: string; sector: string; slot: string; }
interface UserData {
  vehicle: Vehicle;
  membership: Membership;
  payments: Payment[];
  location: LocationInfo;
  blacklist: boolean;
  blacklistReason?: string;
  pendingAmount?: number;
  tariffs?: { pending?: Tariff[]; history?: Tariff[]; };
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // <- necesario para ngIf/ngFor/ngClass y pipes
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'], // <-- asegúrate que exista este archivo
    encapsulation: ViewEncapsulation.None  // <- deshabilita scope
})
export class UserDashboardComponent implements OnInit {
  sidebarOpen = false;
  selectedSection: keyof any = 'dashboard';

  menuItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'vehicle', label: 'Vehículo' },
    { key: 'membership', label: 'Membresía' },
    { key: 'payments', label: 'Pagos' },
    { key: 'location', label: 'Ubicación' },
    { key: 'tariffs', label: 'Tarifas' },
    { key: 'blacklist', label: 'Lista Negra' }
  ];

  loading = false;
  error: string | null = null;

  userData: UserData = {
    vehicle: { plate: 'ABC123', type: 'Carro' },
    membership: { status: 'Activa', expiration: new Date(2025, 10, 10) },
    payments: [
      { id: 1, date: new Date(), description: 'Tarifa hora', amount: 5000 },
      { id: 2, date: new Date(), description: 'Mensualidad', amount: 80000 }
    ],
    location: { zone: 'Zona A', sector: 'Sector 1', slot: '15B' },
    blacklist: false,
    blacklistReason: undefined,
    pendingAmount: 0,
    tariffs: {
      pending: [
        { id: 't1', description: 'Estacionamiento 2 horas', amount: 6000, when: new Date() }
      ],
      history: [
        { id: 'h1', description: 'Estacionamiento 1 hora', amount: 3000, when: new Date(Date.now() - 86400000) }
      ]
    }
  };

  ngOnInit(): void {
    this.userData.pendingAmount = this.calculatePending();
    this.sidebarOpen = window.innerWidth >= 768;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.sidebarOpen = window.innerWidth >= 768;
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }

  selectSection(key: string): void {
    this.selectedSection = key;
    if (window.innerWidth < 768) this.sidebarOpen = false;
  }

  calculatePending(): number {
    const fromPending = (this.userData.tariffs?.pending || []).reduce((s, t) => s + (t.amount || 0), 0);
    const explicit = this.userData.pendingAmount ?? 0;
    return Math.max(0, fromPending + explicit);
  }

  getPendingAmount(): number { return this.calculatePending(); }

  async payAll(): Promise<void> {
    this.loading = true; this.error = null;
    try {
      await this.fakeDelay(800);
      const pend = this.userData.tariffs?.pending || [];
      this.userData.tariffs = this.userData.tariffs || { pending: [], history: [] };
      this.userData.tariffs.history = [...(this.userData.tariffs.history || []), ...pend];
      this.userData.tariffs.pending = []; this.userData.pendingAmount = 0;
    } catch (err) {
      this.error = 'No se pudo procesar el pago. Intente de nuevo.';
    } finally { this.loading = false; }
  }

  async payTariff(t: Tariff): Promise<void> {
    this.loading = true;
    try {
      await this.fakeDelay(600);
      if (!this.userData.tariffs) this.userData.tariffs = { pending: [], history: [] };
      this.userData.tariffs.pending = (this.userData.tariffs.pending || []).filter(x => x.id !== t.id);
      this.userData.tariffs.history = [...(this.userData.tariffs.history || []), t];
      this.userData.pendingAmount = this.calculatePending();
    } finally { this.loading = false; }
  }

  viewPayment(p: Payment): void { console.log('Ver pago', p); }

  markBlacklist(reason?: string): void {
    this.userData.blacklist = true; this.userData.blacklistReason = reason ?? 'Motivo no especificado';
  }
  unmarkBlacklist(): void { this.userData.blacklist = false; this.userData.blacklistReason = undefined; }
  openBlacklistModal(): void { console.log('Abrir modal lista negra'); }

  trackById(index: number, item: any): any { return item?.id ?? index; }

  private fakeDelay(ms = 500): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }
}
