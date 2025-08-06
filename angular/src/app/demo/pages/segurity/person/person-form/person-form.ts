import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import { Person } from '../person';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-person-form',
  imports: [ReactiveFormsModule,MatFormFieldModule, MatLabel,MatInputModule, MatSlideToggleModule  ],
  templateUrl: './person-form.html',
  styleUrl: './person-form.scss'
})
export class PersonForm implements OnInit {
form: FormGroup;
  isEdit = false;

  private FormBuilder = inject(FormBuilder);
  private ActivatedRoute = inject(ActivatedRoute);
  private route = inject(Router);
  private service = inject(General);



  constructor() {
    this.form = this.FormBuilder.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      asset: [false]
    });
  }

  ngOnInit(): void {
  const id = this.ActivatedRoute.snapshot.paramMap.get('id');
  if (id) {
    this.isEdit = true;
    this.service.getById<{ success: boolean; data: Person }>('Person', id).subscribe(response => {
      if (response.success) {
        this.form.patchValue(response.data);
      }
    });
  }
}



 save(): void {
  if (this.form.invalid) return;

  const data = { ...this.form.value };

  if (this.isEdit) {
    this.service.put('Person', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro actualizado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/persons-index']);
    });
  } else {
    delete data.id;
    this.service.post('Person', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro creado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/persons-index']);
    });
  }
}



}
