import { StartAppGuard, UserDomainGuard } from './core/start-app.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PrefixNot } from '@angular/compiler';

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
      }
    ]
  },

  /** Login and Signup */
  {
    path: 'passport',
    pathMatch: 'prefix',
    loadChildren: () => import('./pages/passport/passport.module').then(m => m.PassportPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
