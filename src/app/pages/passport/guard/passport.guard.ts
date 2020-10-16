import { SharedModule } from './../../../shared/shared.module';
import { LocalStorageService } from './../../../shared/service/local-storage.service';
import { AccountManageService } from '../../../shared/service/account-manage.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

/** 如果在登录页面有合法的登录信息，直接登录 redirect to 'home' */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(private localstorage: LocalStorageService, private accountService: AccountManageService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
        const token = this.localstorage.get(StaticValue.LOGIN_TOKEN, null);
        if(token) {
            if (this.accountService.userBasicInfo(token)) {
                this.router.navigateByUrl(StaticValue.URLS.HOME);
                return false;
            }
            this.localstorage.remove(StaticValue.LOGIN_TOKEN);
        }
        return true;
    }
}

