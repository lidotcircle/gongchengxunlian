import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopInfoPageRoutingModule } from './shop-info-routing.module';

import { ShopInfoPage } from './shop-info.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    ShopInfoPageRoutingModule
  ],
  declarations: [ShopInfoPage]
})
export class ShopInfoPageModule {}
