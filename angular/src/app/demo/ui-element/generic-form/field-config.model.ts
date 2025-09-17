/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldType = 'text' | 'tel' | 'number' | 'toggle' | 'textarea' | 'select'| 'date' | 'time' ;

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: { value: any; label: string }[]; // para selects/radios
   multiple?: boolean;
   validations?: {
    name: string;
    validator: string;
    message: string;
    value?: any;
  }[];
hidden?: boolean;

}
export enum ValidatorNames {
  Required = 'required',
  MinLength = 'minlength',
  MaxLength = 'maxlength',
  Pattern = 'pattern',
  Min = 'min',
  Max = 'max',
<<<<<<< HEAD
  MinDate = "MinDate"
=======
   UniqueName = 'uniqueName' // <- Para verificar nombres duplicados
>>>>>>> 6a635e5b5fd11d04e0fa72261f5b03713fb660f6
}
export interface FieldValidation {
  validator: ValidatorNames | string; // Permitimos custom names
  value?: any; 
  message: string;
  custom?: boolean; // true si el validador es propio del sistema   // Mensaje de error por defecto
}