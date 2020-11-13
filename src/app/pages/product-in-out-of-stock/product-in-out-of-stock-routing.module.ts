import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductInOutOfStockPage } from './product-in-out-of-stock.page';

const routes: Routes = [
  {
    path: '',
    component: ProductInOutOfStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductInOutOfStockPageRoutingModule {}
