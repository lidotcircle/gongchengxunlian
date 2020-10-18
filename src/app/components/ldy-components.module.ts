import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyrightComponent } from './copyright/copyright.component';
import { LogoComponent } from './logo/logo.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [CopyrightComponent, LogoComponent, HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    CopyrightComponent, LogoComponent, HeaderComponent
  ]
})
export class LdyComponentsModule { }
