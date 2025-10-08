/* eslint-disable @angular-eslint/prefer-inject */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { General } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-select-parking',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './select-parking.html',
  styleUrl: './select-parking.scss',
})
export class SelectParking implements OnInit {
  parkings: any[] = [];
  selectedParkingId: number | null = null;

  constructor(private general: General, private router: Router) {}

  ngOnInit(): void {
    this.loadParkingsFromLogin();
  }

  /**
   * 🔹 Carga los parqueaderos del usuario desde el localStorage
   * (guardados después del login)
   */
  loadParkingsFromLogin(): void {
    const stored = localStorage.getItem('rolesByParking');
    if (stored) {
      this.parkings = JSON.parse(stored);
    } else {
      console.warn('⚠️ No se encontraron parqueaderos en el localStorage.');
    }
  }

  /**
   * 🔹 Selecciona un parqueadero, guarda su ID y nombre
   * y navega al dashboard o módulo principal.
   */
  selectParking(parking: any): void {
    this.selectedParkingId = parking.parkingId;
    localStorage.setItem('parkingId', parking.parkingId.toString());
    localStorage.setItem('parkingName', parking.parkingName);
    localStorage.setItem('roleName', parking.roleName);

    this.router.navigate(['/analytics']);
  }
}
