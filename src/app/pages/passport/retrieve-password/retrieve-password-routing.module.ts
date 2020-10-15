import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetrievePasswordPage } from './retrieve-password.page';

const routes: Routes = [
  {
    path: '',
    component: RetrievePasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetrievePasswordPageRoutingModule {}
