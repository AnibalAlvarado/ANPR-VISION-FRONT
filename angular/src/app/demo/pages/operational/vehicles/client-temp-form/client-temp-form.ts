/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { General } from 'src/app/generic/general.service';
import { Person } from 'src/app/generic/Models/Entitys';
import { PersonTempForm } from '../person-temp-form/person-temp-form';

@Component({
  selector: 'app-client-temp-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './client-temp-form.html',
  styleUrl: './client-temp-form.scss'
})
export class ClientTempForm implements OnInit {
  form: FormGroup;
  people: any[] = [];
  tempPerson: any = null;   // 🔹 guardamos persona temporal

  private service = inject(General);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClientTempForm>,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')
      ]],
      personId: ['', Validators.required]
    });
  }

  ngOnInit() {
    // 🚀 cargar personas reales
    this.service.get<Person[]>('Person/select').subscribe({
      next: (items) => {
        this.people = (items || []).map(p => ({
          value: p.id,
          label: `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim()
        }));
      },
      error: (err: Error) => {
        console.error('Error cargando personas:', err);
      }
    });
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;

      // 🚀 si el personId es temporal, primero guardamos la persona en BD
      if (String(data.personId).startsWith('temp-person-') && this.tempPerson) {
        this.service.post<Person>('Person', this.tempPerson).subscribe({
          next: (createdPerson) => {
            // reemplazar id temporal con id real
            data.personId = createdPerson.id;
            this.dialogRef.close(data);
          },
          error: (err: Error) => {
            console.error('Error creando persona temporal:', err);
          }
        });
      } else {
        this.dialogRef.close(data);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  // 🚀 Abrir modal de persona temporal
  openPersonTempModal() {
    const dialogRef = this.dialog.open(PersonTempForm, { width: '500px' });

    dialogRef.afterClosed().subscribe((tempPerson) => {
      if (tempPerson) {
        const fakeId = `temp-person-${Date.now()}`;

        // agregar opción temporal
        this.people.push({
          value: fakeId,
          label: `${tempPerson.firstName} ${tempPerson.lastName}`
        });

        // asignar automáticamente
        this.form.get('personId')?.setValue(fakeId);

        // guardamos en memoria
        this.tempPerson = tempPerson;
      }
    });
  }
}
