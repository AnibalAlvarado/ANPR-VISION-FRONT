export type FieldType = 'text' | 'tel' | 'number' | 'toggle' | 'textarea' | 'select';

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
}
