import { LocalStorageService } from './../shared/service/local-storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { StaticValue } from '../shared/static-value/static-value.module';
import { ClientAccountManagerService } from '../shared/service/client-account-manager.service';


/** 检查是否第一次启动，如果否 redirect to 'login' */
@Injectable({
  providedIn: 'root'
})
export class StartAppGuard implements CanActivate {
    constructor(private localstorage: LocalStorageService,
                private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
        const appConfig: StaticValue.AppConfig = this.localstorage.get(StaticValue.APP_KEY, {
            isLaunched: false,
            version: StaticValue.APP_VERSION
        });
        if (appConfig.isLaunched) {
            this.router.navigateByUrl(StaticValue.URLS.SIGNIN);
            return false;
        } else {
            appConfig.isLaunched = true;
            this.localstorage.set(StaticValue.APP_KEY, appConfig);
            return true;
        }
    }
}


/** 需要登录的页面，如果没有合法的登录信息 redirect to 'welcome' */
@Injectable({
  providedIn: 'root'
})
export class UserDomainGuard implements CanActivate {
    constructor(private accountService: ClientAccountManagerService,
                private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
        return new Promise((resolve) => {
            this.accountService.userinfo().then((info) => {
                if (info) {
                    resolve(true);
                } else {
                    this.router.navigateByUrl(StaticValue.URLS.WELCOME);
                    resolve(false);
                }
            });
        });
    }
}
