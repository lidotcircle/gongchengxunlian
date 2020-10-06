import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassportPage } from './passport.page';
import { LoginGuard } from './guard/passport.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [LoginGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassportPageRoutingModule {}
