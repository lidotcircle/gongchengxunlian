import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeInfoPageRoutingModule } from './change-info-routing.module';

import { ChangeInfoPage } from './change-info.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    ChangeInfoPageRoutingModule
  ],
  declarations: [ChangeInfoPage]
})
export class ChangeInfoPageModule {}
