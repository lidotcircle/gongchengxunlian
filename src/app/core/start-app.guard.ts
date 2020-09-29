import { LocalStorageService } from './../shared/service/local-storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StaticValue } from '../shared/static-value/static-value.module';

@Injectable({
  providedIn: 'root'
})
export class StartAppGuard implements CanActivate {
  constructor(private localstorage: LocalStorageService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    const appConfig: any = this.localstorage.get(StaticValue.APP_KEY, {
      hasRun: false,
      version: StaticValue.APP_VERSION
    });
    if (!appConfig.hasRun) {
      appConfig.hasRun = true;
      this.localstorage.set(StaticValue.APP_KEY, appConfig);
      return true;
    } else {
      this.router.navigateByUrl('home');
      return false;
    }
  }
}
