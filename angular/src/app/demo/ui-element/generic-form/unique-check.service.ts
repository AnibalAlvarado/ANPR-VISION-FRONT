import { Injectable, inject } from '@angular/core';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { General } from 'src/app/generic/general.service';

@Injectable({ providedIn: 'root' })
export class UniqueCheckService {
  private generalService = inject(General);

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
      .set('field', fieldName)                                     
      .set('value', String(value))                                  
      .set('currentId', (formValue as { id?: string })?.id ?? '');  

    return this.generalService
      .get<{ success: boolean; exists?: boolean; message?: string }>(
        `${entity}/check`,  
        params
      )
      .pipe(
        map((r) => {
          if (!r.success) {
            return { exists: true, message: r.message ?? `${fieldName} ya está en uso` };
          }
          return { exists: !!r.exists, message: r.message ?? `${fieldName} ya está en uso` };
        }),
       catchError((err: HttpErrorResponse) => {
        const serverError = err.status >= 500 && err.status < 600;
        const apiMsg =
        (err?.error?.errors?.value?.[0]) ||
        (err?.error?.errors?.field?.[0]) ||
        err?.error?.title ||
        `Error validando el ${fieldName}`;
        return of({
        exists: serverError ? false : true, 
        message: apiMsg
        });
      })

      );
  }
}
