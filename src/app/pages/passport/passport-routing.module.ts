import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassportPage } from './passport.page';

const routes: Routes = [
  {
    path: '',
    component: PassportPage
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassportPageRoutingModule {}
