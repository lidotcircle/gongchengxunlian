import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassportPageRoutingModule } from './passport-routing.module';

import { PassportPage } from './passport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassportPageRoutingModule
  ],
  declarations: [PassportPage]
})
export class PassportPageModule {}
