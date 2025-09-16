// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { RoleForm } from './demo/pages/segurity/role/role-form/role-form';
import { RoleIndex } from './demo/pages/segurity/role/role-index/role-index';
import { PersonIndex } from './demo/pages/segurity/person/person-index/person-index';
import { UserIndex } from './demo/pages/segurity/user/user-index/user-index';
import { UserForm } from './demo/pages/segurity/user/user-form/user-form';
import { PersonPrueba } from './demo/pages/segurity/person/person-prueba/person-prueba';
import { ModuleIndex } from './demo/pages/segurity/module/module-index/module-index';
import { ModuleForm } from './demo/pages/segurity/module/module-form/module-form';
import { FormIndex } from './demo/pages/segurity/form/form-index/form-index';
import { FormForm } from './demo/pages/segurity/form/form-form/form-form';
import { PermissionIndex } from './demo/pages/segurity/permission/permission-index/permission-index';
import { PermissionForm } from './demo/pages/segurity/permission/permission-form/permission-form';
import { FormModuleIndex } from './demo/pages/segurity/form-module/form-module-index/form-module-index';
import { FormModuleForm } from './demo/pages/segurity/form-module/form-module-form/form-module-form';
import { RolFormPerIndex } from './demo/pages/segurity/rolFormPermission/rol-form-per-index/rol-form-per-index';
import { RolFormPerForm } from './demo/pages/segurity/rolFormPermission/rol-form-per-form/rol-form-per-form';
import { MembershipsTypeIndex } from './demo/pages/parameters/membershipsType/memberships-type-index/memberships-type-index';
import { MembershipsTypeForm } from './demo/pages/parameters/membershipsType/memberships-type-form/memberships-type-form';
import { ProfileIndex } from './demo/pages/segurity/profile/profile-index/profile-index';
import { VehicleTypeIndex } from './demo/pages/parameters/vehicleType/vehicle-type-index/vehicle-type-index';
import { VehicleTypeForm } from './demo/pages/parameters/vehicleType/vehicle-type-form/vehicle-type-form';
import { RateTypeIndex } from './demo/pages/parameters/ratesType/rate-type-index/rate-type-index';
import { RateTypeForm } from './demo/pages/parameters/ratesType/rate-type-form/rate-type-form';
import { ParkingCategoryIndex } from './demo/pages/parameters/parkingCategory/parking-category-index/parking-category-index';
import { ParkingCategoryForm } from './demo/pages/parameters/parkingCategory/parking-category-form/parking-category-form';
import { BackListIndex } from './demo/pages/segurity/backlist/back-list-index/back-list-index';
import { ZonesIndex } from './demo/pages/parameters/zones/zones-index/zones-index';
import { ZonesForm } from './demo/pages/parameters/zones/zones-form/zones-form';
import { ParkingForm } from './demo/pages/parameters/parking/parking-form/parking-form';
import { ParkingIndex } from './demo/pages/parameters/parking/parking-index/parking-index';
import { SectorsIndex } from './demo/pages/parameters/sectors/sectors-index/sectors-index';
import { SectorsForm } from './demo/pages/parameters/sectors/sectors-form/sectors-form';
import { SlotsIndex } from './demo/pages/parameters/slots/slots-index/slots-index';
import { SlotsForm } from './demo/pages/parameters/slots/slots-form/slots-form';
import { VehicleIndex } from './demo/pages/operational/vehicles/vehicle-index/vehicle-index';
import { VehicleForm } from './demo/pages/operational/vehicles/vehicle-form/vehicle-form';
import { ParkingManagement } from './demo/pages/parking-zone/parking-management/parking-management';
import { RegisteredVehicleIndex } from './demo/pages/operational/registeredVehicle/registered-vehicle-index/registered-vehicle-index';
import { HelpCenterComponent } from './help/help-center.component';
import { ResetPassword } from './demo/pages/authentication/reset-password/reset-password';
import { ClientIndex } from './demo/pages/segurity/client/client-index/client-index';
import { ClientForm } from './demo/pages/segurity/client/client-form/client-form';
import { BlackListForm } from './demo/pages/segurity/backlist/black-list-form/black-list-form';
import { CameraIndex } from './demo/pages/cameras/camera-index/camera-index';
import { CameraForm } from './demo/pages/cameras/camera-form/camera-form';
import { MemberShipsIndex } from './demo/pages/operational/memberShips/member-ships-index/member-ships-index';
import { MemberShipsForm } from './demo/pages/operational/memberShips/member-ships-form/member-ships-form';
import { RatesIndex } from './demo/pages/operational/rates/rates-index/rates-index';
import { RatesForm } from './demo/pages/operational/rates/rates-form/rates-form';
import { Configuration } from './demo/configuration/configuration/configuration';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component').then((c) => c.DashAnalyticsComponent)
      },
      {
        path: 'persons-index',
        component: PersonIndex
      },
      { path: 'persona-form', component: PersonPrueba },
      { path: 'persona-form/:id', component: PersonPrueba },
       {
        path: 'role-index',
        component: RoleIndex
      },
       { path: 'role-form', component: RoleForm },
      { path: 'role-form/:id', component: RoleForm },
      { path: 'user-index', component: UserIndex },
      { path: 'user-form', component: UserForm },
      { path: 'user-form/:id', component: UserForm },
      { path: 'module-index', component: ModuleIndex },
      { path: 'module-form', component: ModuleForm },
      { path: 'module-form/:id', component: ModuleForm },
      { path: 'form-index', component: FormIndex },
      { path: 'form-form', component: FormForm },
      { path: 'form-form/:id', component: FormForm },
      {path: 'permission-index', component: PermissionIndex},
      {path: 'permission-form', component: PermissionForm},
      {path: 'permission-form/:id', component: PermissionForm},
      {path: 'form-module-index', component: FormModuleIndex},
      {path: 'formModule-form', component: FormModuleForm},
      {path: 'formModule-form/:id', component: FormModuleForm},
      {path: 'rolFormPermission-index', component: RolFormPerIndex},
      {path: 'rolFormPermission-form', component: RolFormPerForm},
      {path: 'rolFormPermission-form/:id', component: RolFormPerForm},
      {path: 'memberShipType-index', component: MembershipsTypeIndex},
      {path: 'memberShipType-form', component: MembershipsTypeForm},
      {path: 'memberShipType-form/:id', component: MembershipsTypeForm},
      {path: 'profile-index', component: ProfileIndex},
      {path: 'TypeVehicle-index', component: VehicleTypeIndex},
      {path: 'TypeVehicle-form', component: VehicleTypeForm},
      {path: 'TypeVehicle-form/:id', component: VehicleTypeForm},
      {path: 'RatesType-index', component: RateTypeIndex},
      {path: 'RatesType-form', component: RateTypeForm},
      {path: 'RatesType-form/:id', component: RateTypeForm},
      {path: 'ParkingCategory-index', component: ParkingCategoryIndex},
      {path: 'ParkingCategory-form', component: ParkingCategoryForm},
      {path: 'ParkingCategory-form/:id', component: ParkingCategoryForm},
      {path: 'BackList-index', component: BackListIndex},
      {path: 'Zones-index', component: ZonesIndex},
      {path: 'Zones-form', component: ZonesForm},
      {path: 'Zones-form/:id', component: ZonesForm},
      {path: 'parking-index', component: ParkingIndex},
      {path: 'parking-form', component: ParkingForm},
      {path: 'parking-form/:id', component: ParkingForm},
      {path: 'sectors-index', component: SectorsIndex},
      {path: 'sectors-form', component: SectorsForm},
      {path: 'sectors-form/:id', component: SectorsForm},
      {path: 'slots-index', component: SlotsIndex},
      {path: 'slots-form', component: SlotsForm},
      {path: 'slots-form/:id', component: SlotsForm},
      {path: 'vehicles-index', component: VehicleIndex},
      {path: 'vehicles-form', component: VehicleForm},
      {path: 'vehicles-form/:id', component: VehicleForm},
      {path: 'parking-management', component: ParkingManagement},
      {path: 'registeredVehicle-index', component: RegisteredVehicleIndex},
      {path: 'client-index', component: ClientIndex},
      {path: 'client-form', component: ClientForm},
      {path: 'client-form/:id', component: ClientForm},
      {path: 'blackList-index', component: BackListIndex},
      {path: 'blackList-form', component: BlackListForm},
      {path: 'blackList-form/:id', component: BlackListForm},
      {path: 'cameras-index', component: CameraIndex},
      {path: 'cameras-form', component: CameraForm},
      {path: 'cameras-form/:id', component: CameraForm},
      {path: 'memberShips-index', component: MemberShipsIndex},
      {path: 'memberShips-form', component: MemberShipsForm},
      {path: 'memberShips-form/:id', component: MemberShipsForm},
      {path: 'rates-index', component: RatesIndex},
      {path: 'rates-form', component: RatesForm},
      {path: 'rates-form/:id', component: RatesForm},
      {path: 'configuracion', component: Configuration},

      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart-maps/core-apex.component').then((c) => c.CoreApexComponent)
      },



      {
        path: 'zonas-parqueadero',
        loadComponent : ()=> import('./demo/zonas/zonas-parqueadero/zonas.parqueadero.component').then((c) => c.ZonasParqueadero)
      },
      {
        path: 'help-center',
        component: HelpCenterComponent
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/sign-up/sign-up.component').then((c) => c.SignUpComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/sign-in/sign-in.component').then((c) => c.SignInComponent)
      },
      {path: 'reset-password', component: ResetPassword},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
