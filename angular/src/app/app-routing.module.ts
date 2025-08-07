// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { PersonForm } from './demo/pages/segurity/person/person-form/person-form';
import { RoleForm } from './demo/pages/segurity/role/role-form/role-form';
import { RoleIndex } from './demo/pages/segurity/role/role-index/role-index';
import { PersonIndex } from './demo/pages/segurity/person/person-index/person-index';
import { UserIndex } from './demo/pages/segurity/user/user-index/user-index';
import { UserForm } from './demo/pages/segurity/user/user-form/user-form';

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
      { path: 'persona-form', component: PersonForm },
      { path: 'persona-form/:id', component: PersonForm },
       {
        path: 'role-index',
        component: RoleIndex
      },
       { path: 'role-form', component: RoleForm },
      { path: 'role-form/:id', component: RoleForm },
      { path: 'user-index', component: UserIndex },
      { path: 'user-form', component: UserForm },
      { path: 'user-form/:id', component: UserForm },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart-maps/core-apex.component').then((c) => c.CoreApexComponent)
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms/form-elements/form-elements.component').then((c) => c.FormElementsComponent)
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component').then((c) => c.TblBootstrapComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'zonas-parqueadero',
        loadComponent : ()=> import('./demo/zonas/zonas-parqueadero/zonas.parqueadero.component').then((c) => c.ZonasParqueadero)
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
