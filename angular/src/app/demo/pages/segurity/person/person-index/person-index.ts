import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { General } from 'src/app/generic/general.service';
import { Person } from '../person';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-person-index',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatIconModule, CommonModule, FormsModule,MatTooltipModule],
  templateUrl: './person-index.html',
  styleUrl: './person-index.scss'
})
export class PersonIndex implements OnInit {


  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber', 'asset', 'acciones'];

  dataSource = new MatTableDataSource<Person>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _generalService = inject(General);
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.getAllPersons();
  }

 getAllPersons(): void {
  this._generalService.get<{ data: Person[] }>('Person/select').subscribe(response => {
    this.dataSource.data = response.data;
    this.dataSource.paginator = this.paginator;
  });
}

goToCreate(): void {
  this.router.navigate(['/persona-form']);
}

goToEdit(person: Person): void {
  this.router.navigate(['/persona-form', person.id]);
}


deletePerson(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará a la persona permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      this._generalService.delete('Person', id).subscribe(() => {
        Swal.fire('¡Eliminado!', 'La persona ha sido eliminada.', 'success');
        this.getAllPersons();
      });
    }
  });
}




}
