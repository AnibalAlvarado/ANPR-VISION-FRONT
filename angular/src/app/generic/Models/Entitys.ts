// Entities.ts
import { IBaseEntity } from "./IBaseEntity";
import { IEntity } from "./IEntity";

// entidades que no necesitan atributos extra
export type Form = IEntity;
export type Module = IEntity;
export type Role = IEntity;
export type Permission = IEntity;

// entidades que sí necesitan atributos extra
export interface Person extends IBaseEntity {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IUser extends IBaseEntity {
  username: string;
  email: string;
  password: string;
  personid: number;
  personname?: string;
}



export interface FormModule extends IBaseEntity {
  formId: number;
  moduleId: number;
  formName: string;
  moduleName: string;
}

export interface User extends IBaseEntity {
  userName: string;
  email: string;
  password: string;
  personId: number;
  personName: string;
}
