import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassportGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
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


  
}
