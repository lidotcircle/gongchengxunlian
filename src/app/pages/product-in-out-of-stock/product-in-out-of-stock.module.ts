import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductInOutOfStockPageRoutingModule } from './product-in-out-of-stock-routing.module';

import { ProductInOutOfStockPage } from './product-in-out-of-stock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductInOutOfStockPageRoutingModule
  ],
  declarations: [ProductInOutOfStockPage]
})
export class ProductInOutOfStockPageModule {}
