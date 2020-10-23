import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryListPageRoutingModule } from './category-list-routing.module';

import { CategoryListPage } from './category-list.page';
import { LdyComponentsModule } from 'src/app/components/ldy-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LdyComponentsModule,
    CategoryListPageRoutingModule
  ],
  declarations: [CategoryListPage]
})
export class CategoryListPageModule {}
