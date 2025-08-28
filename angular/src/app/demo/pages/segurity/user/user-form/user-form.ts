/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,AbstractControl, AsyncValidatorFn  } from '@angular/forms';
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
import { of } from 'rxjs';
import { debounceTime, map, switchMap, catchError } from 'rxjs/operators';

/* --- VALIDADOR ASÍNCRONO --- */
export function usernameExistsValidator(service: General, currentUserId?: string): AsyncValidatorFn {
  
  return (control: AbstractControl) => {
    if (!control.value) return of(null);

    return of(control.value).pipe(
      debounceTime(300),
      switchMap(username => {
        const params = new HttpParams().set('username', username);
        return service.get<{ success: boolean; exists: boolean }>('User/check-username',  params );
      }),
      map(res => {
        if (res.success && res.exists && control.parent?.get('id')?.value !== currentUserId) {
          return { usernameExists: true };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  };
}

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    FormsModule,
    MatDividerModule,
    MatIcon
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})


export class UserForm implements OnInit {
[x: string]: any;
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

      onCancelar(): void {
    this.route.navigate(['/user-index']);
  }
  constructor() {
    this.form = this.FormBuilder.group({
      id: [null],
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z0-9_-]+$/)
        ],
         [usernameExistsValidator(this.service, this.userId)]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
          ) // Al menos una mayúscula, un número y un carácter especial
        ]
      ],
      personId: ['', Validators.required],
      asset: [true]
    });

  }

  
  ngOnInit(): void {
    this.getAllPersons();
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.userId = id;
      this.getAllRoles();
      this.loadUserRoles(id);

      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();

      this.service.getById<{ success: boolean; data: User }>('User', id).subscribe(response => {
        if (response.success) {
          const userData = { ...response.data, password: '' };
          this.originalPassword = response.data.password;
          this.form.patchValue(userData);
        }
      });
    } else {
      this.form.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]);
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
    this.service.get(`User/roles/${userId}`).subscribe((res: any) => {
      if (res.success) {
        this.userRoles = res.data.map((role: any) => ({
          ...role,
          asset: Boolean(role.asset)
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = { ...this.form.value };

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
    const asset = this.rolUserAsset;

    if (userId && rolId != null) {
      const payload = { userId, rolId, asset };

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
