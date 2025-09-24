/* eslint-disable @angular-eslint/prefer-inject */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { VehicleType } from '../../../parameters/vehicleType/vehicle-type';
import { Client } from 'src/app/generic/Models/Entitys';
import { MatDialog } from '@angular/material/dialog';
import { ClientTempForm } from '../client-temp-form/client-temp-form';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-vehicle-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss'
})
export class VehicleForm implements OnInit {
 form!: FormGroup;
  isEdit = false;
  tempClient: any = null;

  typeVehicles: any[] = [];
  clients: any[] = [];

  private service = inject(General);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    // construir formulario
    this.form = this.fb.group({
      id: [null],
      plate: ['', Validators.required],
      color: ['', Validators.required],
      typeVehicleId: [null, Validators.required],
      clientId: [null, Validators.required],
      asset: [true]
    });

    // cargar tipos de vehículo
    this.service.get<VehicleType[]>('TypeVehicle/select').subscribe({
      next: (items) => {
        this.typeVehicles = (items || []).map(it => ({ value: it.id, label: it.name }));
      },
      error: (err: Error) => {
        Swal.fire('Error', err.message || 'No se pudieron cargar los tipos de vehículo.', 'error');
      }
    });

    // cargar clientes
    this.service.get<Client[]>('Client/join').subscribe({
      next: (items) => {
        this.clients = (items || []).map(it => ({ value: it.id, label: it.name }));
      },
      error: (err: Error) => {
        Swal.fire('Error', err.message || 'No se pudieron cargar los clientes.', 'error');
      }
    });

    // si es edición
    if (this.isEdit && id) {
      this.service.getById<any>('Vehicle', id).subscribe({
        next: (item) => {
          this.form.patchValue(item);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo cargar el vehículo.', 'error');
        }
      });
    }
  }

  openClientTempModal() {
    const dialogRef = this.dialog.open(ClientTempForm, { width: '500px' });

    dialogRef.afterClosed().subscribe((tempClient) => {
      if (tempClient) {
        const fakeId = `temp-${Date.now()}`;
        this.clients.push({ value: fakeId, label: tempClient.name });
        this.form.get('clientId')?.setValue(fakeId);
        this.tempClient = { ...tempClient, fakeId };
      }
    });
  }

  save() {
    const data = { ...this.form.value };

    // si hay cliente temporal
    if (String(data.clientId).startsWith('temp-') && this.tempClient) {
      this.service.post<Client>('Client', this.tempClient).subscribe({
        next: (createdClient) => {
          data.clientId = createdClient.id;
          this.saveVehicle(data);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo crear el cliente.', 'error');
        }
      });
    } else {
      this.saveVehicle(data);
    }
  }

  private saveVehicle(data: any) {
    if (!this.isEdit) {
      delete data.id;
      this.service.post('Vehicle', data).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Vehículo creado exitosamente', timer: 2000, showConfirmButton: false });
          this.router.navigate(['/vehicles-index']);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo crear el vehículo.', 'error');
        }
      });
    } else {
      this.service.put('Vehicle', data).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Vehículo actualizado exitosamente', timer: 2000, showConfirmButton: false });
          this.router.navigate(['/vehicles-index']);
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo actualizar el vehículo.', 'error');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/vehicles-index']);
  }

}
