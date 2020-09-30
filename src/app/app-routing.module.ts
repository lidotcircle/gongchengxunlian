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

    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule ),
        canActivate: [LoginGuard]
    },
    {
        path: 'signup',
        loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
