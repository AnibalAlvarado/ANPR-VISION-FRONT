import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { General } from 'src/app/generic/general.service';

@Injectable({
  providedIn: 'root'
})
export class UniqueCheckService {
  private generalService = inject(General);

  /**
   * Verifica si un valor ya existe para cualquier entidad.
   * Captura el mensaje del backend incluso si success = false.
   */
  checkUnique(
    entity: string,
    fieldName: string,
    value: unknown,
    formValue: unknown
  ): Observable<{ exists: boolean; message?: string }> {
    if (!value || `${value}`.trim() === '') {
      return of({ exists: false });
    }

    const params = new HttpParams()
      .set(fieldName, String(value))
      .set('currentId', (formValue as { id?: string })?.id ?? '');

    return this.generalService
      .get<{ success: boolean; exists?: boolean; message?: string }>(
        `${entity}/check`,
        params
      )
      .pipe(
        map((r) => {
          // Si la API devuelve success=false, lo tratamos como error
          if (!r.success) {
            return { exists: true, message: r.message };
          }
          return { exists: !!r.exists, message: r.message ?? `${fieldName} ya está en uso` };
        }),
        catchError(() =>
          of({
            exists: false,
            message: `Error validando el ${fieldName}`
          })
        )
      );
  }

  /**
   * Verifica si el valor es string.
   */
  isString(value: unknown): value is string {
    return typeof value === 'string';
  }
}
