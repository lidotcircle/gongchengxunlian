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
