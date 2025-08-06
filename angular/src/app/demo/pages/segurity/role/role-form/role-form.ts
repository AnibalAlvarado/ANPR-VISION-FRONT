import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import Swal from 'sweetalert2';
import { Role } from '../role';


@Component({
  selector: 'app-role-form',
    imports: [ReactiveFormsModule,MatFormFieldModule,MatInputModule, MatSlideToggleModule  ],
  templateUrl: './role-form.html',
  styleUrl: './role-form.scss'
})
export class RoleForm  implements OnInit{
form: FormGroup;
  isEdit = false;

  private FormBuilder = inject(FormBuilder);
  private ActivatedRoute = inject(ActivatedRoute);
  private route = inject(Router);
  private service = inject(General);



  constructor() {
    this.form = this.FormBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      asset: [false]
    });
  }

  ngOnInit(): void {
  const id = this.ActivatedRoute.snapshot.paramMap.get('id');
  if (id) {
    this.isEdit = true;
    this.service.getById<{ success: boolean; data: Role }>('Rol', id).subscribe(response => {
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
    this.service.put('Rol', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro actualizado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/role-index']);
    });
  } else {
    delete data.id;
    this.service.post('Rol', data).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registro creado exitosamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.route.navigate(['/role-index']);
    });
  }
}
}
