import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryEditPageRoutingModule } from './category-edit-routing.module';

import { CategoryEditPage } from './category-edit.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';
import { CategoryNameEditPage } from './category-name-edit/category-name-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LdyComponentsModule,
    CategoryEditPageRoutingModule
  ],
  declarations: [CategoryEditPage, CategoryNameEditPage]
})
export class CategoryEditPageModule {}
