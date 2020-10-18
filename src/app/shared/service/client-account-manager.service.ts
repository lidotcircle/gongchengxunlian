import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StaticValue } from '../static-value/static-value.module';
import { AccountManageService } from './account-manage.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientAccountManagerService {
  private token: string = null;

  constructor(private localstorage: LocalStorageService,
              private remoteAccountManagerWrapper: AccountManageService,
              private router: Router) {
                this.token = this.localstorage.get(StaticValue.LOGIN_TOKEN, null);
              }

  private update() {
    this.token = this.localstorage.get(StaticValue.LOGIN_TOKEN, null);
  }

  async logout() {
    this.update();
    this.remoteAccountManagerWrapper.removeLoginToken(this.token);
    this.localstorage.remove(StaticValue.LOGIN_TOKEN);
    this.token = null;

    this.router.navigateByUrl('/');
  }

  async userinfo(): Promise<StaticValue.UserBasicInfo> {
    this.update();
    if (this.token != null) {
      const ans = this.remoteAccountManagerWrapper.userBasicInfo(this.token);
      return ans;
    }
    return null;
  }

  async updateUserInfo(info: StaticValue.UserBasicInfo): Promise<boolean> {
    return false;
  }
}
