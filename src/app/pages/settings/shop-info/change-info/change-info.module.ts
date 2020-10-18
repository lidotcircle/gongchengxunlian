import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeInfoPageRoutingModule } from './change-info-routing.module';

import { ChangeInfoPage } from './change-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeInfoPageRoutingModule
  ],
  declarations: [ChangeInfoPage]
})
export class ChangeInfoPageModule {}
