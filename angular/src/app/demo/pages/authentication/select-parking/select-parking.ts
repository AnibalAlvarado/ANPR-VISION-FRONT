/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnInit } from '@angular/core';
import { General } from 'src/app/generic/general.service';
import { Parking } from '../../parameters/parking/parking';
import { Router } from '@angular/router';
import {  MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-parking',
  imports: [MatCardModule, CommonModule],
  templateUrl: './select-parking.html',
  styleUrl: './select-parking.scss'
})
export class SelectParking implements OnInit {
 parkings: Parking[] = [];
  selectedParkingId: number | null = null;
  personId: number = 0;

  constructor(private general: General, private router: Router) {}

  ngOnInit(): void {
    // 🔹 Recuperar personId del localStorage (guardado en login)
    // const personIdStr = localStorage.getItem('personId');
    const personIdStr = this.general.getPersonId();
    if (personIdStr) {
      this.personId = Number(personIdStr);
      this.loadParkings();
    }
  }

  loadParkings(): void {
    this.general.get<Parking[]>(`personparking/by-person/${this.personId}`).subscribe({
      next: (res) => {
        this.parkings = res;
      },
      error: (err) => {
        console.error('Error al cargar parqueaderos:', err.message);
      }
    });
  }

  selectParking(parking: Parking): void {
    this.selectedParkingId = parking.id;
    localStorage.setItem('parkingId', parking.id.toString());
    this.router.navigate(['/analytics']);
    // aquí podrías navegar a otra ruta (ej: dashboard)
    // this.router.navigate(['/dashboard']);
  }
}
