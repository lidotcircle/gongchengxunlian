import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyrightComponent } from './copyright/copyright.component';
import { LogoComponent } from './logo/logo.component';


@NgModule({
  declarations: [CopyrightComponent, LogoComponent],
  imports: [
    CommonModule
  ],
  exports: [
    CopyrightComponent, LogoComponent
  ]
})
export class LdyComponentsModule { }
