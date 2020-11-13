import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductInOutRecordsPageRoutingModule } from './product-in-out-records-routing.module';

import { ProductInOutRecordsPage } from './product-in-out-records.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    SharedModule,
    ProductInOutRecordsPageRoutingModule
  ],
  declarations: [ProductInOutRecordsPage]
})
export class ProductInOutRecordsPageModule {}
