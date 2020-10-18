import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefaultPageRoutingModule } from './default-routing.module';

import { DefaultPage } from './default.page';
import { ToolComponent } from './tool/tool.component';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    DefaultPageRoutingModule
  ],
  declarations: [DefaultPage, ToolComponent]
})
export class DefaultPageModule {}
