import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

/** 如果在登录页面有合法的登录信息，直接登录 redirect to 'home' */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    constructor(private router: Router,
                private accountManager: ClientAccountManagerService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
        return new Promise((resolve) => {
            this.accountManager.userinfo().then(info => {
                if(info) {
                    this.router.navigateByUrl(StaticValue.URLS.HOME);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}
