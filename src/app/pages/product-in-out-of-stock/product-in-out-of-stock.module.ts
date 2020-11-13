import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductInOutOfStockPageRoutingModule } from './product-in-out-of-stock-routing.module';

import { ProductInOutOfStockPage } from './product-in-out-of-stock.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    SharedModule,
    ProductInOutOfStockPageRoutingModule
  ],
  declarations: [ProductInOutOfStockPage]
})
export class ProductInOutOfStockPageModule {}
