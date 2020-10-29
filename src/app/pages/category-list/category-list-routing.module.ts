import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryListPage } from './category-list.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryListPage
  },
  {
    path: 'add-item',
    loadChildren: () => import('./add-item/add-item.module').then( m => m.AddItemPageModule)
  },
  {
    path: 'category-edit',
    loadChildren: () => import('./category-edit/category-edit.module').then( m => m.CategoryEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryListPageRoutingModule {}
