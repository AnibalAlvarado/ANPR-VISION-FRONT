/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldConfig, ValidatorNames } from 'src/app/demo/ui-element/generic-form/field-config.model';
import { GenericForm } from 'src/app/demo/ui-element/generic-form/generic-form';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { Parking } from '../../parameters/parking/parking';

@Component({
  selector: 'app-camera-form',
  imports: [GenericForm],
  templateUrl: './camera-form.html',
  styleUrl: './camera-form.scss'
})
export class CameraForm implements OnInit {
  formConfig: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'El nombre es obligatorio.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 3, message: 'El nombre debe tener al menos 3 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 25, message: 'El nombre no puede exceder los 25 caracteres.' }
      ]
    },
    {
      name: 'resolution',
      label: 'Resolución',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La resolución es obligatoria.' },
        { name: ValidatorNames.MinLength, validator: ValidatorNames.MinLength, value: 3, message: 'Debe tener al menos 3 caracteres.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 50, message: 'No puede superar los 50 caracteres.' }
      ]
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      required: true,
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'La URL es obligatoria.' },
        { name: ValidatorNames.MaxLength, validator: ValidatorNames.MaxLength, value: 250, message: 'La URL no puede superar los 250 caracteres.' },
        { name: ValidatorNames.Pattern, validator: ValidatorNames.Pattern, value: '^(https?|rtsp):\\/\\/[^\\s/$.?#].[^\\s]*$', message: 'Debe ser una URL válida con protocolo (http, https o rtsp).' }
      ]
    },
    {
      name: 'parkingId',
      label: 'Parqueadero al que pertenece',
      type: 'select',
      required: true,
      options: [],
      validations: [
        { name: ValidatorNames.Required, validator: ValidatorNames.Required, message: 'Debe seleccionar un parqueadero.' }
      ]
    },
    {
      name: 'asset',
      label: 'Activo',
      type: 'toggle',
      value: true,
      hidden: true
    }
  ];

  isEdit = false;
  initialData: any = {};

  private service = inject(General);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    // Cargar parqueaderos (robusto a distintas formas de respuesta)
    this.service.get<any>('Parking/select').subscribe({
      next: (res) => {
        const list: Parking[] = Array.isArray(res) ? res : (res?.data ?? res?.Data ?? []);
        const options = (list ?? []).map((p: any) => ({
          value: p.id,
          label: p.name ?? p.parking ?? `Parking ${p.id}`
        }));

        this.formConfig = this.formConfig.map(f =>
          f.name === 'parkingId' ? { ...f, options } : f
        );
      },
      error: (err: Error) => {
        Swal.fire('Error', err.message || 'No se pudieron cargar los parqueaderos.', 'error');
      }
    });

    // Modo edición
    if (id) {
      this.isEdit = true;
      this.service.getById<{ success: boolean; data: any }>('Cameras', id).subscribe({
        next: (response) => {
          if (response?.success) this.initialData = response.data;
        },
        error: (err: Error) => {
          Swal.fire('Error', err.message || 'No se pudo cargar la cámara.', 'error');
        }
      });
    }
  }

  save(data: any) {
    if (this.isEdit) {
      this.service.put('Cameras', data).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Registro actualizado exitosamente', showConfirmButton: false, timer: 2000, timerProgressBar: true });
          this.route.navigate(['/cameras-index']);
        },
        error: (err: Error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo actualizar', text: err.message });
        }
      });
    } else {
      delete data.id;
      this.service.post('Cameras', data).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Registro creado exitosamente', showConfirmButton: false, timer: 2000, timerProgressBar: true });
          this.route.navigate(['/cameras-index']);
        },
        error: (err: Error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo crear', text: err.message });
        }
      });
    }
  }

  cancel() { this.route.navigate(['/cameras-index']); }
}
