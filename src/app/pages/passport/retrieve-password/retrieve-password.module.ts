import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetrievePasswordPageRoutingModule } from './retrieve-password-routing.module';

import { RetrievePasswordPage } from './retrieve-password.page';
import { LogoComponent } from 'src/app/components/logo/logo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetrievePasswordPageRoutingModule
  ],
  declarations: [RetrievePasswordPage, LogoComponent]
})
export class RetrievePasswordPageModule {}
