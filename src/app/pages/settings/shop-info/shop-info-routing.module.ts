import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopInfoPage } from './shop-info.page';

const routes: Routes = [
  {
    path: '',
    component: ShopInfoPage
  },
  {
    path: 'change-info',
    loadChildren: () => import('./change-info/change-info.module').then( m => m.ChangeInfoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopInfoPageRoutingModule {}
