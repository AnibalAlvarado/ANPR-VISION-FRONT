/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy, inject, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { General } from 'src/app/generic/general.service';
import { User, Person } from 'src/app/generic/Models/Entitys';

// Ajusta rutas si tus diálogos están en otra carpeta
import { EditUserDialogComponent } from '../../pages/segurity/profile/edit-user-dialog-component/edit-user-dialog-component';
import { EditPersonDialogComponent } from '../../pages/segurity/profile/edit-person-dialog-component/edit-person-dialog-component';

@Component({
  selector: 'app-configuration',
  imports: [CommonModule, FormsModule, MatDialogModule, EditUserDialogComponent, EditPersonDialogComponent],
  templateUrl: './configuration.html',
  styleUrls: ['./configuration.scss']
})
export class Configuration implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private service = inject(General);
  private dialog = inject(MatDialog);

  // modelos tipados según tu genérico
  userData: User | null = null;
  personData: Person | null = null;

  // Nuevo: username obtenido desde General
  userName: string | null = null;

  // estado UI
  loading = false;
  errorMessage = '';

  // estado para mostrar/ocultar sidebar
  showSidebar = false;

  userProfile = {
    name: 'Usuario',
    registrationDate: '—',
    location: '—',
    birthDate: '—',
    email: '—',
    phone: '—',
    isDeleted: false,
    asset: false
  };

  // placeholders
  userCourses: any[] = [];
  paymentInfo = { lastFourDigits: 'XXXX' };

  // userId desde localStorage via General
  private userIdStr: string | null = null;
  private userid = 0;

  // TrackBy para ngFor de cursos
  trackByCourse: TrackByFunction<any> = (_index: number, item: any) => item?.id ?? _index;

  constructor() {}

  ngOnInit(): void {
    this.userName = this.service.getUsername?.() ?? null;
    this.userIdStr = this.service.getUserId?.() ?? null;
    this.userid = Number(this.userIdStr ?? 0);

    this.initPlaceholders();

    if (this.userid && !isNaN(this.userid) && this.userid > 0) {
      this.loadUser(this.userid);
    } else {
      this.errorMessage = 'Usuario no autenticado';
      console.warn('No userId disponible en General.getUserId()');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initPlaceholders(): void {
    this.userCourses = [
      { id: 1, title: 'Configuracion del parqueadero', description: 'Descripción', lessonCount: 10, status: 'Начат', isCompleted: false, isCurrent: true, startDate: null },
      { id: 1, title: 'Cámaras en el parqueadero', description: 'Descripción', lessonCount: 10, status: 'Начат', isCompleted: false, isCurrent: true, startDate: null },
    ];
    this.paymentInfo = { lastFourDigits: '2065' };
  }

  /** Carga User y luego Person si existe personId */
  loadUser(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.service.getById<User>('User', id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.loading = false;
          this.errorMessage = `No se pudo cargar el usuario: ${err?.message ?? err}`;
          console.error('Error get User', err);
          return of(null);
        })
      )
      .subscribe((user) => {
        this.loading = false;
        if (!user) return;
        this.userData = user;
        this.applyToProfile();

        const pid = (user as any)?.personId;
        if (pid) {
          this.loadPerson(Number(pid));
        }
      });
  }

  loadPerson(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.service.getById<Person>('Person', id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.loading = false;
          this.errorMessage = `No se pudo cargar la persona: ${err?.message ?? err}`;
          console.error('Error get Person', err);
          return of(null);
        })
      )
      .subscribe((person) => {
        this.loading = false;
        if (!person) return;
        this.personData = person;
        this.applyToProfile();
      });
  }

  private applyToProfile(): void {
    const u = this.userData ?? ({} as User);
    const p = this.personData ?? ({} as Person);

    const fullNamePerson = (p.firstName || p.lastName) ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : '';
    const name = fullNamePerson || (u as any).personName || (u as any).userName || this.userName || 'Usuario';

    const email = u.email ?? '—';
    const phone = (p && (p as any).phoneNumber) ? (p as any).phoneNumber : '—';

    const birthDate = (p as any).birthDate ? this.formatDate((p as any).birthDate) : ((p as any).age ? `${(p as any).age} años` : '—');

    const registrationDate = (u as any).createdAt ? this.formatDate((u as any).createdAt)
      : (u as any).created_on ? this.formatDate((u as any).created_on)
      : (u.id ? `ID: ${u.id}` : '—');

    const location = this.composeLocation(p);

    this.userProfile = {
      name,
      registrationDate,
      location: location || '—',
      birthDate,
      email,
      phone,
      isDeleted: !!(u as any).isDeleted || !!(p as any).isDeleted,
      asset: !!(u as any).asset || !!(p as any).asset
    };
  }

  private composeLocation(p?: Person | null): string {
    if (!p) return '';
    const parts: string[] = [];
    if ((p as any).country) parts.push((p as any).country);
    if ((p as any).city) parts.push((p as any).city);
    return parts.join(', ');
  }

  private formatDate(raw: any): string {
    if (!raw) return '—';
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return String(raw);
      return d.toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return String(raw);
    }
  }

  get firstLetter(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : '';
  }

  // ---------------- acciones UI (sin tocar la lógica original) ----------------
  openEditUserDialog(): void {
    try {
      const ref = this.dialog.open(EditUserDialogComponent, { width: '420px', data: { ...(this.userData ?? {}) }});
      ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res === 'updated') this.reload();
      });
    } catch (err) {
      console.warn('EditUserDialogComponent no disponible o error al abrir diálogo', err);
    }
  }

  openEditPersonDialog(): void {
    try {
      const ref = this.dialog.open(EditPersonDialogComponent, { width: '420px', data: { ...(this.personData ?? {}) }});
      ref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res === 'updated') this.reload();
      });
    } catch (err) {
      console.warn('EditPersonDialogComponent no disponible o error al abrir diálogo', err);
    }
  }

  reload(): void {
    if (this.userid) this.loadUser(this.userid);
  }

  /**
   * Abre la sidebar (muestra la columna derecha).
   * Prevents default si viene de un <a>.
   */
  openParkInfo(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showSidebar = true;

    // opcional: desplazarse suavemente para que el usuario vea la sidebar
    setTimeout(() => {
      const container = document.querySelector('.profile-container');
      if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // y opcionalmente enfocar la sidebar
      const sidebar = document.querySelector('.sidebar-section');
      (sidebar as HTMLElement | null)?.focus();
    }, 80);
  }

  closeSidebar(): void {
    this.showSidebar = false;
  }
}
