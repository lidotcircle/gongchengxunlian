import { StartAppGuard, LoginGuard, UserDomainGuard } from './core/start-app.guard';
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
        loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule),
        canActivate: [StartAppGuard]
    },

    /** require login info, else redirect to welcome page */
    {
        path: '',
        canActivate: [UserDomainGuard],
        children: [
            {
                path: 'folder/:id',
                loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
            },
            {
                path: 'home',
                loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
            },
        ]
    },
  {
    path: 'passport',
    loadChildren: () => import('./pages/passport/passport.module').then( m => m.PassportPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
