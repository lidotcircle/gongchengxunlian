import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductListPageRoutingModule } from './product-list-routing.module';

import { ProductListPage } from './product-list.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    SharedModule,
    ProductListPageRoutingModule
  ],
  declarations: [ProductListPage]
})
export class ProductListPageModule {}
