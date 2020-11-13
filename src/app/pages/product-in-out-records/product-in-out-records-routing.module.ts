import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductInOutRecordsPage } from './product-in-out-records.page';

const routes: Routes = [
  {
    path: '',
    component: ProductInOutRecordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductInOutRecordsPageRoutingModule {}
