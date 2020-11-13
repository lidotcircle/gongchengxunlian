import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    SharedModule,
    ProductDetailPageRoutingModule
  ],
  declarations: [ProductDetailPage]
})
export class ProductDetailPageModule {}
