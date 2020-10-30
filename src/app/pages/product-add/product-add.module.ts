import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductAddPageRoutingModule } from './product-add-routing.module';

import { ProductAddPage } from './product-add.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    SharedModule,
    ProductAddPageRoutingModule
  ],
  providers: [
    BarcodeScanner
  ],
  declarations: [ProductAddPage]
})
export class ProductAddPageModule {}
