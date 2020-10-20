import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetrievePasswordPageRoutingModule } from './retrieve-password-routing.module';

import { RetrievePasswordPage } from './retrieve-password.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetrievePasswordPageRoutingModule,
    SharedModule,
    LdyComponentsModule
  ],
  declarations: [RetrievePasswordPage]
})
export class RetrievePasswordPageModule {}
