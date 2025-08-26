/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */
// angular import
import { Component, viewChild,TemplateRef, inject, OnInit, ViewChild  } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { ProductSaleComponent } from './product-sale/product-sale.component';

import { ChartDB } from 'src/app/fack-db/chartData';

// 3rd party import

import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatError, MatFormFieldModule, MatLabel,  } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { General } from 'src/app/generic/general.service';
import { Client } from 'src/app/generic/Models/Entitys';
import { VehicleType } from '../pages/parameters/vehicleType/vehicle-type';
import Swal from 'sweetalert2';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-dash-analytics',
  imports: [SharedModule, NgApexchartsModule, MatDialogModule, MatFormFieldModule,MatLabel,MatError,MatButtonModule,MatInputModule,MatOptionModule,CommonModule,MatSelectModule],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export class DashAnalyticsComponent implements OnInit {
  formData: any = {};
  vehicleTypes: { value: number; label: string }[] = [];
  clients: { value: number; label: string }[] = [];
 private service = inject(General);

  // 👀 referenciamos los templates
  @ViewChild('vehicleFormModal') vehicleFormModal!: TemplateRef<any>;
  @ViewChild('secondModal') secondModal!: TemplateRef<any>;


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartDB: any;

  // public props
  chart = viewChild<ChartComponent>('chart');
  customerChart = viewChild<ChartComponent>('customerChart');
  chartOptions!: Partial<ApexOptions>;
  chartOptions_1!: Partial<ApexOptions>;
  chartOptions_2!: Partial<ApexOptions>;
  chartOptions_3!: Partial<ApexOptions>;
  bar1CAC: ApexOptions;
  radialBar1CAC: ApexOptions;


  // constructor
  constructor(private dialog: MatDialog) {
    this.chartDB = ChartDB;
    const {
      bar1CAC,
      radialBar1CAC,

    } = this.chartDB;
     this.bar1CAC = bar1CAC;
    this.radialBar1CAC = radialBar1CAC;


    this.chartOptions = {
      chart: {
        height: 205,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      series: [
        {
          name: 'Arts',
          data: [20, 50, 30, 60, 30, 50]
        },
        {
          name: 'Commerce',
          data: [60, 30, 65, 45, 67, 35]
        }
      ],
      legend: {
        position: 'top'
      },
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000'],
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: true,
        min: 10,
        max: 70
      },
      colors: ['#73b4ff', '#59e0c5'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          gradientToColors: ['#4099ff', '#2ed8b6'],
          shadeIntensity: 0.5,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      grid: {
        borderColor: '#cccccc3b'
      }
    };
    this.chartOptions_1 = {
      chart: {
        height: 150,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%'
          }
        }
      },
      labels: ['New', 'Return'],
      series: [39, 10],
      legend: {
        show: false
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      colors: ['#4680ff', '#2ed8b6'],
      fill: {
        opacity: [1, 1]
      },
      stroke: {
        width: 0
      }
    };
    this.chartOptions_2 = {
      chart: {
        height: 150,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%'
          }
        }
      },
      labels: ['New', 'Return'],
      series: [20, 15],
      legend: {
        show: false
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      colors: ['#fff', '#2ed8b6'],
      fill: {
        opacity: [1, 1]
      },
      stroke: {
        width: 0
      }
    };
    this.chartOptions_3 = {
      chart: {
        type: 'area',
        height: 145,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#ff5370'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#ff869a'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100, 100, 100]
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [
        {
          data: [45, 35, 60, 50, 85, 70]
        }
      ],
      yaxis: {
        min: 5,
        max: 90
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        marker: {
          show: false
        }
      }
    };
  }
  cards = [
    {
      background: 'bg-c-blue',
      title: 'Vehículos estacionados hoy',
      icon: 'fas fa-car',
      number: '48',
    },
    {
      background: 'bg-c-green',
      title: 'Ingresos del día',
      icon: 'fas fa-dollar-sign',
      number: '5.641',
    },
    {
      background: 'bg-c-yellow',
      title: 'Slots disponibles',
      icon: 'fas fa-draw-polygon',
      number: '150',
    },
    {
      background: 'bg-c-red',
      title: 'Membresías activas',
      icon: 'fas fa-credit-card',
      number: '120',
    }
  ];

  images = [
    {
      src: 'assets/images/gallery-grid/img-grd-gal-1.jpg',
      title: 'Old Scooter',
      size: 'PNG-100KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-2.jpg',
      title: 'Wall Art',
      size: 'PNG-150KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-3.jpg',
      title: 'Microphone',
      size: 'PNG-150KB'
    }
  ];
ngOnInit(): void {
    // Cargar tipos de vehículo
    this.service.get<{ data: VehicleType[] }>('TypeVehicle/select')
      .subscribe(res => {
        if (res.data) {
          this.vehicleTypes = res.data.map(item => ({
            value: item.id,
            label: item.name
          }));
        }
      });

    // Cargar clientes
    this.service.get<{ data: Client[] }>('Client/join')
      .subscribe(res => {
        if (res.data) {
          this.clients = res.data.map(item => ({
            value: item.id,
            label: item.name
          }));
        }
      });
  }

//  openFormDialog(templateRef: any) {
//     this.formData = {}; // reset para crear
//     this.dialog.open(templateRef, { width: '600px' });
//   }

   // abrir modal principal
  openFormDialog(templateRef: TemplateRef<any>) {
    this.formData = {}; // reset para crear
    this.dialog.open(templateRef, { width: '600px' });
  }
 save(data: any) {
    delete data.id; // por si acaso
    this.service.post('Vehicle', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Vehículo creado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        // 🚀 cerrar modal del form
        this.dialog.closeAll();

        // 🚀 abrir modal 2 después del Swal
        this.dialog.open(this.secondModal, { width: '400px' });
      });
    });
  }





}
