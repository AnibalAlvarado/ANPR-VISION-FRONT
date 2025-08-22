import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { General } from 'src/app/generic/general.service';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { User } from 'src/app/generic/Models/Entitys';

@Component({
  selector: 'app-user-form',
    imports: [ReactiveFormsModule,MatFormFieldModule, MatLabel,MatInputModule, MatSlideToggleModule, MatSelectModule,MatOptionModule,CommonModule,FormsModule,MatDividerModule, MatIcon  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserForm implements OnInit {
form: FormGroup;
  isEdit = false;
  persons: { id: number; firstName: string }[] = [];
  originalPassword: string = '';
  roles: { id: number; name: string }[] = [];
selectedRoleId: number | null = null;
rolUserAsset: boolean = true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
userRoles: any[] = [];
editIndex: number | null = null;





  private FormBuilder = inject(FormBuilder);
  private ActivatedRoute = inject(ActivatedRoute);
  private route = inject(Router);
  private service = inject(General);
  userId: string = '';




  constructor() {
    this.form = this.FormBuilder.group({
      id: [null],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: [''],
      personId: ['', Validators.required],
      asset: [false]
    });
  }

ngOnInit(): void {
  this.getAllPersons();
  const id = this.ActivatedRoute.snapshot.paramMap.get('id');

  if (id) {
    this.isEdit = true;
    this.userId = id; // ✅ Establece userId (lo necesitas para loadUserRoles)
    this.getAllRoles();

    this.loadUserRoles(id); // ✅ Aquí cargas los roles del usuario (por asset, etc.)

    // Si estás editando: no requerir la contraseña
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();

    this.service.getById<{ success: boolean; data: User }>('User', id).subscribe(response => {
      if (response.success) {
        const userData = { ...response.data, password: '' }; // no mostrar la contraseña
        this.originalPassword = response.data.password;       // guardar la contraseña original
        this.form.patchValue(userData);
      }
    });

  } else {
    // Si estás creando: la contraseña es requerida
    this.form.get('password')?.setValidators(Validators.required);
    this.form.get('password')?.updateValueAndValidity();
  }
}




  getAllPersons(): void {
 this.service.get<{ success: boolean; data: { id: number; firstName: string }[] }>('Person/select')
  .subscribe(response => {
    if (response.success) {
      this.persons = response.data;
    }
  });

}

getAllRoles(): void {
  this.service.get<{ success: boolean; data: { id: number; name: string }[] }>('Rol/select')
    .subscribe(response => {
      if (response.success) {
        this.roles = response.data;
      }
    });
}

loadUserRoles(userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  this.service.get(`User/roles/${userId}`).subscribe((res: any) => {
    if (res.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.userRoles = res.data.map((role: any) => ({
        ...role,
        asset: Boolean(role.asset) // asegura que sea booleano real
      }));
    }
  });
}


onDeleteRole(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el rol permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.delete('RolUser/permanent', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'El rol ha sido eliminado.', 'success');
        this.loadUserRoles(this.userId);
      });
    }
  });
}

 save(): void {
  if (this.form.invalid) return;

  const data = { ...this.form.value };

  // Si estamos editando y no se ingresó nueva contraseña, usamos la original
  if (this.isEdit && !data.password) {
    data.password = this.originalPassword;
  }

  if (this.isEdit) {
  this.service.put('User', data).subscribe(() => {
    Swal.fire({
      icon: 'success',
      title: 'Registro actualizado exitosamente',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    this.route.navigate(['/user-index']);
  });
} else {
  delete data.id;
  this.service.post('User', data).subscribe(() => {
    Swal.fire({
      icon: 'success',
      title: 'Registro creado exitosamente',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    this.route.navigate(['/user-index']);
  });
}

}
assignRole(): void {
  const userId = this.form.get('id')?.value;
  const rolId = this.selectedRoleId;
  const asset = this.rolUserAsset; // valor del toggle

  if (userId && rolId != null) {
    const payload = {
      userId,
      rolId,
      asset
    };

    this.service.post('RolUser', payload).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Rol asignado correctamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      this.loadUserRoles(userId);
    });
  }
}



}
