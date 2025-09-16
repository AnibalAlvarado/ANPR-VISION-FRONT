/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { VehicleType } from '../../../parameters/vehicleType/vehicle-type';
import { Client } from 'src/app/generic/Models/Entitys';

@Component({
  selector: 'app-vehicle-form',
  imports: [GenericForm],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss'
})
export class VehicleForm implements OnInit {
  formConfig: FieldConfig[] = [
    { name: 'plate', label: 'Placa', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'text', required: true },
    {
      name: 'typeVehicleId',
      label: 'Tipo de Vehículo',
      type: 'select',
      required: true,
      options: []
    },
    {
      name: 'clientId',
      label: 'Dueño del Vehículo',
      type: 'select',
      required: true,
      options: []
    },
    { name: 'asset', label: 'Activo', type: 'toggle' }
  ];

  isEdit = false;
  initialData: any = {};

  private service = inject(General);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    // Cargar tipos de vehículo
    this.service.get<VehicleType[]>('TypeVehicle/select').subscribe({
      next: (items) => {
        const opts = (items || []).map(it => ({ value: it.id, label: it.name }));
        this.formConfig = this.formConfig.map(f =>
          f.name === 'typeVehicleId' ? { ...f, options: opts } : f
        );
      },
      error: (err: Error) => {
        Swal.fire('Error', err.message || 'No se pudieron cargar los tipos de vehículo.', 'error');
      }
    });

    // Cargar clientes
    this.service.get<Client[]>('Client/join').subscribe({
      next: (items) => {
        const opts = (items || []).map(it => ({ value: it.id, label: it.name }));
        this.formConfig = this.formConfig.map(f =>
          f.name === 'clientId' ? { ...f, options: opts } : f
        );
      },
      error: (err: Error) => {
        Swal.fire('Error', err.message || 'No se pudieron cargar los clientes.', 'error');
      }
    });

    // Modo edición
    if (id) {
      this.isEdit = true;
      this.service.getById<any>('Vehicle', id).subscribe({
        next: (item) => { this.initialData = item; },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo cargar el vehículo.', 'error');
        }
      });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Vehicle', data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro actualizado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          this.route.navigate(['/vehicles-index']);
        },
        error: (err: Error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo actualizar', text: err.message });
        }
      });
    } else {
      delete data.id;
      this.service.post('Vehicle', data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro creado exitosamente',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          this.route.navigate(['/vehicles-index']);
        },
        error: (err: Error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo crear', text: err.message });
        }
      });
    }
  }

  cancel() {
    this.route.navigate(['/vehicles-index']);
  }
}
