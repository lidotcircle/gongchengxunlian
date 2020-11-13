import { StartAppGuard, UserDomainGuard } from './core/start-app.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },

  /** first runing this app will should this */
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule),
    canActivate: [StartAppGuard]
  },

  /** HOME */
  {
    path: '',
    canActivate: [UserDomainGuard],
    children: [
      {
        path: 'folder/:id',
        loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
      },
      {
        path: 'default',
        loadChildren: () => import('./pages/default/default.module').then(m => m.DefaultPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'category-list',
        loadChildren: () => import('./pages/category-list/category-list.module').then(m => m.CategoryListPageModule)
      },
      {
        path: 'product-add',
        loadChildren: () => import('./pages/product-add/product-add.module').then(m => m.ProductAddPageModule)
      },
      {
        path: 'product-list',
        loadChildren: () => import('./pages/product-list/product-list.module').then(m => m.ProductListPageModule)
      },
      {
        path: 'product-detail',
        loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
      },
      {
        path: 'product-in-out-of-stock',
        loadChildren: () => import('./pages/product-in-out-of-stock/product-in-out-of-stock.module').then(m => m.ProductInOutOfStockPageModule)
      },
    ]
  },

  /** Login and Signup */
  {
    path: 'passport',
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/passport/passport.module').then(m => m.PassportPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
