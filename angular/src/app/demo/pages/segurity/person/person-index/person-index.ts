import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GenericTable } from 'src/app/demo/ui-element/generic-table/generic-table';
import { Person } from '../person';
import { General } from 'src/app/generic/general.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person-prueba',
  imports: [GenericTable],
  templateUrl: './person-index.html',
  styleUrl: './person-index.scss'
})
export class PersonIndex implements OnInit {
  dataSource = new MatTableDataSource<Person>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


columns = [
  { key: 'firstName', label: 'Nombre' },
  { key: 'lastName', label: 'Apellido' },
  { key: 'phoneNumber', label: 'Teléfono' },
  { key: 'asset', label: 'Estado' }
];

  private _generalService = inject(General);
  private router = inject(Router);

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
