/* dynamic-validator.service.ts */
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {  map } from 'rxjs/operators';
import { ValidatorNames } from './field-config.model'; 

export type UniqueCheckFn = (
  fieldName: string,
  value: unknown,
  formValue: unknown
) => Observable<{ exists: boolean; message?: string }>;

@Injectable({
  providedIn: 'root'
})
export class DynamicValidatorService {

  constructor() {}


  getValidators(
    validations?: { name: string; validator: string; message: string; value?: unknown }[],
    uniqueCheck?: UniqueCheckFn,
    fieldName?: string
  ): { sync: ValidatorFn[]; async: AsyncValidatorFn[] } {
    const sync: ValidatorFn[] = [];
    const async: AsyncValidatorFn[] = [];

    if (!validations) return { sync, async };

    for (const rule of validations) {
      switch (rule.validator) {
        case ValidatorNames.Required:
        case 'required':
          sync.push(Validators.required);
          break;

        case ValidatorNames.MinLength:
        case 'minlength':
          sync.push(Validators.minLength(Number(rule.value)));
          break;

        case ValidatorNames.MaxLength:
        case 'maxlength':
          sync.push(Validators.maxLength(Number(rule.value)));
          break;

        case ValidatorNames.Pattern:
        case 'pattern':
          sync.push(Validators.pattern(rule.value as string | RegExp));
          break;

        case ValidatorNames.Min:
        case 'min':
          sync.push(Validators.min(Number(rule.value)));
          break;

        case ValidatorNames.Max:
        case 'max':
          sync.push(Validators.max(Number(rule.value)));
          break;

        case ValidatorNames.UniqueName:
        case 'uniqueName':
          if (uniqueCheck) {
            async.push(this.uniqueNameAsyncValidator(uniqueCheck, fieldName ?? rule.name));
          } else {
            sync.push(this.uniqueNameSyncFallback(rule.message));
          }
          break;

        default:
          console.warn(`Validador no soportado: ${rule.validator}`);
          break;
      }
    }

    return { sync, async };
  }


private uniqueNameAsyncValidator(uniqueCheck: UniqueCheckFn, fieldName: string): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const raw = control.value;
    if (!raw || `${raw}`.trim() === '') return of(null);

    const formValue = control.parent?.getRawValue?.() ?? {};

    return uniqueCheck(fieldName, raw, formValue).pipe(
      map(res => {
        if (res.exists) {
          return { uniqueName: { message: res.message ?? `${fieldName} ya está en uso` } };
        }
        return null;
      })
    );
  };
}

  private uniqueNameSyncFallback(message?: string): ValidatorFn {
    const nombresExistentes = ['Dashboard', 'Usuarios', 'Reportes'];
    return (control: AbstractControl) => {
      const val = control.value?.toString()?.trim();
      if (!val) return null;
      if (nombresExistentes.includes(val)) {
        return { uniqueName: message ?? 'Valor duplicado' };
      }
      return null;
    };
  }
}
