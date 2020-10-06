import { LocalStorageService } from './../shared/service/local-storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as StaticValue from '../shared/static-value/static-value.module';

import { AppConfig, LoginInfo } from '../shared/static-value/static-value.module';
import { LoginInfoService } from '../shared/service/login-info.service';

@Injectable({
  providedIn: 'root'
})
export class StartAppGuard implements CanActivate {
    constructor(private localstorage: LocalStorageService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
        const appConfig: AppConfig = this.localstorage.get(StaticValue.APP_KEY, {
            isLaunched: false,
            version: StaticValue.APP_VERSION
        });
        if (appConfig.isLaunched) {
            this.router.navigateByUrl('login');
            return false;
        } else {
            appConfig.isLaunched = true;
            this.localstorage.set(StaticValue.APP_KEY, appConfig);
            return true;
        }
    }
}

/** if there has login info, redirect to home page */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(private localstorage: LocalStorageService, private loginservice: LoginInfoService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
        if (this.loginservice.login()) {
            this.router.navigateByUrl('home');
            return false;
        }
        return true;
    }
}


/** if there hasn't login info, redirect to welcome page */
@Injectable({
  providedIn: 'root'
})
export class UserDomainGuard implements CanActivate {
    constructor(private localstorage: LocalStorageService, private loginservice: LoginInfoService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
        if(this.loginservice.login())
            return true;
        this.router.navigateByUrl('welcome');
        return false;
    }
}

