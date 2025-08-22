/* eslint-disable @angular-eslint/prefer-inject */
import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import { Person } from 'src/app/generic/Models/Entitys';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-person-dialog-component',
  imports: [
     FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './edit-person-dialog-component.html',
  styleUrl: './edit-person-dialog-component.scss'
})
export class EditPersonDialogComponent {
 constructor(
    public dialogRef: MatDialogRef<EditPersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Person
  ) {}

  private service = inject(General);
  private route = inject(Router);


  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
      // this.dialogRef.close();

    this.service.put('Person', this.data).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado exitosamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
         this.dialogRef.close('updated');
        // this.route.navigate(['/profile-index']);
      });
  }
}
