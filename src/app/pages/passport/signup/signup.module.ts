import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { LogoComponent } from 'src/app/components/logo/logo.component';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';

@NgModule({
  imports: [
    SignupPageRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LdyComponentsModule
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
