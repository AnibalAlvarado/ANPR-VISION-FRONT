/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */

import { Component, viewChild, TemplateRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { ChartDB } from 'src/app/fack-db/chartData';

// 3rd party import
import {
  ApexOptions,
  ChartComponent,
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTooltip
} from 'ng-apexcharts';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

import { General } from 'src/app/generic/general.service';
import { Client, DashboardCard, OccupancyEnvelope, TotalEnvelope } from 'src/app/generic/Models/Entitys';
import { VehicleType } from '../pages/parameters/vehicleType/vehicle-type';
import Swal from 'sweetalert2';
import { Subject, switchMap, takeUntil, timer, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/** Tipado donuts/pies */
type NonAxisChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};

type ZoneOption = { value: number; label: string };

@Component({
  selector: 'app-dash-analytics',
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgApexchartsModule,
    MatDialogModule,
    MatFormFieldModule, MatLabel, MatError,
    MatButtonModule, MatInputModule, MatOptionModule
  ],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export class DashAnalyticsComponent implements OnInit {
  formData: any = {};
  vehicleTypes: { value: number; label: string }[] = [];
  clients: { value: number; label: string }[] = [];

  // Global
  capacity = { occupied: 0, total: 0, free: 0, percentage: 0 };

  // Distribución por tipo
  vehicleTypeTotal = 0;

  // Zonas
  zones: ZoneOption[] = [];
  selectedZoneId: number | null = null;
  zoneCapacity = { id: 0, name: '', occupied: 0, total: 0, free: 0, percentage: 0 };

  private destroy$ = new Subject<void>();
  private service = inject(General);

  // templates
  @ViewChild('vehicleFormModal') vehicleFormModal!: TemplateRef<any>;
  @ViewChild('secondModal') secondModal!: TemplateRef<any>;

  // charts demo
  chartDB: any;
  chart = viewChild<ChartComponent>('chart');
  customerChart = viewChild<ChartComponent>('customerChart');
  chartOptions!: Partial<ApexOptions>;
  chartOptions_1!: Partial<ApexOptions>;
  chartOptions_2!: Partial<ApexOptions>;
  chartOptions_3!: Partial<ApexOptions>;


  // Donut global
  occupancyDonutOptions: NonAxisChartOptions = {
    series: [0.0001, 0.0001],
    chart: { type: 'donut', height: 240, toolbar: { show: false } },
    labels: ['Ocupados', 'Libres'],
    legend: { position: 'bottom', offsetY: 6, fontSize: '12px' },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: { show: false },
            value: { show: false },
            total: {
              show: true,
              label: 'Ocupación',
              formatter: (w: any) => {
                const s: number[] = w.globals.seriesTotals || [0, 0];
                const total = (s[0] ?? 0) + (s[1] ?? 0);
                const occ = s[0] ?? 0;
                return total ? `${Math.round((occ / total) * 100)}%` : '0%';
              }
            }
          }
        }
      }
    },
    tooltip: { y: { formatter: (val: number) => `${val} cupos` } }
  };

  // Pie distribución por tipo
  vehicleTypePieOptions: NonAxisChartOptions = {
    series: [1],
    chart: { type: 'pie', height: 240, toolbar: { show: false } },
    labels: ['Sin datos'],
    legend: { position: 'bottom', offsetY: 6, fontSize: '12px' },
    dataLabels: {
      enabled: true,
      formatter: (_val: number, ctx: any) =>
        `${Math.round(ctx?.w?.globals?.seriesPercent?.[ctx.seriesIndex]?.[0] ?? 0)}%`
    },
    plotOptions: { pie: { expandOnClick: false } },
    tooltip: {
      custom: ({ series, seriesIndex, w }: any) => {
        const count = Number(series?.[seriesIndex] ?? 0);
        const pct = Math.round(w?.globals?.seriesPercent?.[seriesIndex]?.[0] ?? 0);
        const plural = count === 1 ? '' : 's';
        return `<div class="apex-tooltip"><b>${count} vehículo${plural}</b> (${pct}%)</div>`;
      }
    }
  };

  // Donut por zona (nuevo)
  zoneDonutOptions: NonAxisChartOptions = {
    series: [0.0001, 0.0001],
    chart: { type: 'donut', height: 240, toolbar: { show: false } },
    labels: ['Ocupados', 'Libres'],
    legend: { position: 'bottom', offsetY: 6, fontSize: '12px' },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: { show: false },
            value: { show: false },
            total: {
              show: true,
              label: 'Ocupación zona',
              formatter: (w: any) => {
                const s: number[] = w.globals.seriesTotals || [0, 0];
                const total = (s[0] ?? 0) + (s[1] ?? 0);
                const occ = s[0] ?? 0;
                return total ? `${Math.round((occ / total) * 100)}%` : '0%';
              }
            }
          }
        }
      }
    },
    tooltip: { y: { formatter: (val: number) => `${val} cupos` } }
  };

  constructor(private dialog: MatDialog) {


    // tus charts demo
    this.chartOptions = {
      chart: { height: 205, type: 'line', toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { width: 2, curve: 'smooth' },
      series: [
        { name: 'Arts', data: [20, 50, 30, 60, 30, 50] },
        { name: 'Commerce', data: [60, 30, 65, 45, 67, 35] }
      ],
      legend: { position: 'top' },
      xaxis: { type: 'datetime', categories: ['1/11/2000','2/11/2000','3/11/2000','4/11/2000','5/11/2000','6/11/2000'], axisBorder: { show: false } },
      yaxis: { show: true, min: 10, max: 70 },
      colors: ['#73b4ff', '#59e0c5'],
      fill: { type: 'gradient', gradient: { shade: 'light', gradientToColors: ['#4099ff','#2ed8b6'], shadeIntensity: .5, type: 'horizontal', opacityFrom: 1, opacityTo: 1, stops: [0,100] } },
      grid: { borderColor: '#cccccc3b' }
    };
    this.chartOptions_1 = { chart: { height: 150, type: 'donut' }, dataLabels: { enabled: false }, plotOptions: { pie: { donut: { size: '75%' } } }, labels: ['New','Return'], series: [39,10], legend: { show: false }, tooltip: { theme: 'dark' }, grid: { padding: { top: 20, right: 0, bottom: 0, left: 0 } }, colors: ['#4680ff','#2ed8b6'], fill: { opacity: [1,1] }, stroke: { width: 0 } };
    this.chartOptions_2 = { chart: { height: 150, type: 'donut' }, dataLabels: { enabled: false }, plotOptions: { pie: { donut: { size: '75%' } } }, labels: ['New','Return'], series: [20,15], legend: { show: false }, tooltip: { theme: 'dark' }, grid: { padding: { top: 20, right: 0, bottom: 0, left: 0 } }, colors: ['#fff','#2ed8b6'], fill: { opacity: [1,1] }, stroke: { width: 0 } };
    this.chartOptions_3 = { chart: { type: 'area', height: 145, sparkline: { enabled: true } }, dataLabels: { enabled: false }, colors: ['#ff5370'], fill: { type: 'gradient', gradient: { shade: 'dark', gradientToColors: ['#ff869a'], shadeIntensity: 1, type: 'horizontal', opacityFrom: 1, opacityTo: .8, stops: [0,100,100,100] } }, stroke: { curve: 'smooth', width: 2 }, series: [{ data: [45,35,60,50,85,70] }], yaxis: { min: 5, max: 90 }, tooltip: { fixed: { enabled: false }, x: { show: false }, marker: { show: false } } };
  }

  // Cards
  cards: DashboardCard[] = [
    { id: 'currentVehicles', background: 'bg-c-blue', title: 'Vehículos estacionados hoy', icon: 'fas fa-car', number: '—' },
    { id: 'dailyRevenue', background: 'bg-c-green', title: 'Ingresos del día', icon: 'fas fa-dollar-sign', number: '—' },
    { id: 'availableSlots', background: 'bg-c-yellow', title: 'Slots disponibles', icon: 'fas fa-draw-polygon', number: '—' },
    { id: 'activeMemberships', background: 'bg-c-red', title: 'Membresías activas', icon: 'fas fa-credit-card', number: '—' }
  ];

  ngOnInit(): void {
    // tipos de vehículo
    this.service.get<{ data: VehicleType[] }>('TypeVehicle/select').subscribe(res => {
      if (res?.data) this.vehicleTypes = res.data.map(item => ({ value: item.id, label: item.name }));
    });

    // clientes
    this.service.get<{ data: Client[] }>('Client/join').subscribe(res => {
      if (res?.data) this.clients = res.data.map(item => ({ value: item.id, label: item.name }));
    });

    // zonas
    this.loadZones();

    // polling (global + tipos + zona actual)
    this.startDashboardPolling();
  }

  // =================== POLLING ===================
  private startDashboardPolling() {
    timer(0, 10000)
      .pipe(
        switchMap(() =>
          forkJoin({
            total: this.service.get<TotalEnvelope | any>('RegisteredVehicles/current/total-global').pipe(catchError(() => of(null))),
            occupancy: this.service.get<OccupancyEnvelope | any>('Slots/occupancy/global').pipe(catchError(() => of(null))),
            distribution: this.service.get<any>('RegisteredVehicles/distribution/types/global?includeZeros=true').pipe(catchError(() => of(null))),
            zoneOcc: this.selectedZoneId ? this.getZoneOcc$(this.selectedZoneId).pipe(catchError(() => of(null))) : of(null)
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ total, occupancy, distribution, zoneOcc }) => {
        // total
        if (total) {
          const t = Number((total as any)?.data?.total ?? (total as any)?.total ?? 0);
          this.setCardNumberById('currentVehicles', t);
        }

        // ocupación global
        if (occupancy) {
          const d: any = (occupancy as any).data ?? occupancy;
          const occupied = Number(d?.occupied ?? 0);
          const totalSlots = Number(d?.total ?? (occupied + Number(d?.free ?? 0)));
          const free = Math.max(Number(d?.free ?? (totalSlots - occupied)), 0);
          const percentage = totalSlots ? (occupied / totalSlots) * 100 : 0;

          this.capacity = { occupied, total: totalSlots, free, percentage };
          this.occupancyDonutOptions = { ...this.occupancyDonutOptions, series: [Math.max(occupied, 0.0001), Math.max(free, 0.0001)] };
        }

        // distribución por tipo
        if (distribution) {
          const d: any = distribution.data ?? distribution;
          const labels: string[] =
            Array.isArray(d?.labels) && d.labels.length ? d.labels :
            Array.isArray(d?.slices) ? d.slices.map((s: any) => s.name) : [];
          const series: number[] =
            Array.isArray(d?.series) && d.series.length ? d.series.map((n: any) => Number(n ?? 0)) :
            Array.isArray(d?.slices) ? d.slices.map((s: any) => Number(s?.count ?? 0)) : [];

          const sum = series.reduce((a, b) => a + b, 0);
          this.vehicleTypeTotal = Number(d?.total ?? sum);

          this.vehicleTypePieOptions = (!labels.length || sum === 0)
            ? { ...this.vehicleTypePieOptions, labels: ['Sin datos'], series: [1] }
            : { ...this.vehicleTypePieOptions, labels, series };
        }

        // zona
        if (zoneOcc) this.applyZoneOccToDonut(zoneOcc);
      });
  }

  setCardNumberById(id: string, value: number | string) {
    const card = this.cards.find(c => c.id === id);
    if (!card) return;
    card.number = value;
  }

  // ===================== ZONAS =====================

  /** Payload robusto para: {data:[...]}, {data:{data:[...]}}, o el array directo */
  private loadZones() {
    this.service.get<any>('Zones/select').subscribe({
      next: (res) => {
        const arr: any[] =
          Array.isArray(res?.data) ? res.data :
          Array.isArray(res?.data?.data) ? res.data.data :
          Array.isArray(res) ? res : [];

        const notDeleted = (z: any) =>
          !(z?.isDeleted === true || String(z?.isDeleted).toLowerCase() === 'true');

        this.zones = arr
          .filter(notDeleted)
          .map((z: any): ZoneOption => ({
            value: Number(z?.id ?? z?.zoneId ?? z?.value),
            label: String(z?.name ?? z?.zoneName ?? `Zona ${z?.id ?? z?.zoneId ?? ''}`.trim())
          }))
          .filter((opt: ZoneOption) => Number.isFinite(opt.value));

        // Seleccionar primera zona válida y pintar
        if (this.zones.length) {
          if (this.selectedZoneId == null) this.selectedZoneId = this.zones[0].value;
          this.loadZoneOccupancy(this.selectedZoneId);
        }
      },
      error: (err) => {
        console.error("Error al cargar zonas:", err);
        this.zones = [];
        this.selectedZoneId = null;
      }

    });
  }

  onZoneBtnClick(id: number) {
    if (id == null) return;
    this.selectedZoneId = id;
    this.loadZoneOccupancy(id);
  }

  /** Soporta varias rutas posibles del back */
  private getZoneOcc$(zoneId: number) {
    return this.service.get<any>(`RegisteredVehicles/occupancy/sectors/by-zone/${zoneId}`).pipe(
      catchError(() => this.service.get<any>(`RegisteredVehicles/occupancy/sectors/by-zone?zoneId=${zoneId}`)),
      catchError(() => this.service.get<any>(`Slots/occupancy/zone?zoneId=${zoneId}`))
    );
  }

  private loadZoneOccupancy(zoneId: number) {
    this.getZoneOcc$(zoneId).pipe(
      catchError(() => of({
        data: [{
          id: zoneId,
          name: this.zones.find(z => z.value === zoneId)?.label || 'Zona',
          occupied: 0, total: 0, free: 0, percentage: 0
        }]
      }))
    ).subscribe(res => this.applyZoneOccToDonut(res));
  }

  private applyZoneOccToDonut(payload: any) {
    const rows = payload?.data ?? payload ?? [];
    const r = Array.isArray(rows) ? rows[0] : rows;

    const name = r?.name ?? (this.zones.find(z => z.value === this.selectedZoneId)?.label || 'Zona');
    const occupied = Number(r?.occupied ?? 0);
    const total    = Number(r?.total ?? (occupied + Number(r?.free ?? 0)));
    const free     = Math.max(Number(r?.free ?? (total - occupied)), 0);
    const percentage = total ? (occupied / total) * 100 : 0;

    this.zoneCapacity = { id: Number(r?.id ?? this.selectedZoneId ?? 0), name, occupied, total, free, percentage };
    this.zoneDonutOptions = { ...this.zoneDonutOptions, series: [Math.max(occupied, 0.0001), Math.max(free, 0.0001)] };
  }
  // =================================================

  // diálogos
  openFormDialog(templateRef: TemplateRef<any>) {
    this.formData = {};
    this.dialog.open(templateRef, { width: '600px' });
  }

  save(data: any) {
    delete data.id;
    this.service.post('Vehicle', data).subscribe(() => {
      Swal.fire({ icon: 'success', title: 'Vehículo creado exitosamente', showConfirmButton: false, timer: 2000, timerProgressBar: true })
        .then(() => { this.dialog.closeAll(); this.dialog.open(this.secondModal, { width: '400px' }); });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
