import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StaticValue } from '../static-value/static-value.module';
import { AccountManageService, NEW_USER_AUTHCODE_TOKEN, RESET_PASSWORD_AUTHCODE_TOKEN, RESET_PASSWORD_TOKEN } from './account-manage.service';
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

  async login(account: string, password: string): Promise<StaticValue.LoginToken> {
    const token = this.remoteAccountManagerWrapper.login(account, password);
    if (token) {
      this.localstorage.set(StaticValue.LOGIN_TOKEN, token);
      this.invokeChangeHook();
    }
    return token;
  }

  async logout() {
    this.update();
    this.remoteAccountManagerWrapper.removeLoginToken(this.token);
    this.localstorage.remove(StaticValue.LOGIN_TOKEN);
    this.token = null;
    this.invokeChangeHook();

    this.router.navigateByUrl('/');
  }

  private authcode_token: RESET_PASSWORD_AUTHCODE_TOKEN;
  private reset_token: RESET_PASSWORD_TOKEN;
  async resetPasswordRequest(phone: string): Promise<boolean> {
    this.authcode_token = this.remoteAccountManagerWrapper.resetPasswordRequest(phone);
    return !!this.authcode_token;
  }

  async resetPasswordAuthCodeCheck(authcode: string): Promise<boolean> {
    if (!this.authcode_token){
      return false;
    }
    this.reset_token = this.remoteAccountManagerWrapper.resetPasswordAuthCodeCheck(this.authcode_token, authcode);
    this.authcode_token = null;
    return !!this.reset_token;
  }

  async resetPasswordConfirm(password: string): Promise<boolean> {
    if (!this.reset_token) {
      return false;
    }
    const ans = this.remoteAccountManagerWrapper.resetPasswordConfirm(this.reset_token, password);
    this.reset_token = null;
    return ans;
  }

  private new_user_token: NEW_USER_AUTHCODE_TOKEN;
  async newUserRequest(phone: string): Promise<string> {
    const ans = this.remoteAccountManagerWrapper.newUserRequest(phone);
    if (!ans) return null;

    this.new_user_token = ans[0];
    const md5 = ans[1];

    return md5;
  }

  async newUserConfirm(user: StaticValue.SignupDataModel): Promise<boolean> {
    if (!this.new_user_token) return false;
    const token = this.new_user_token;
    this.new_user_token = null;

    return this.remoteAccountManagerWrapper.addUser(token, user);
  }

  async hasUsername(username: string): Promise<boolean> {
    return this.remoteAccountManagerWrapper.hasName(username);
  }

  async hasPhone(phone: string): Promise<boolean> {
    return this.remoteAccountManagerWrapper.hasPhone(phone);
  }

  async hasEmail(email: string): Promise<boolean> {
    return this.remoteAccountManagerWrapper.hasEmail(email);
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
    this.update();
    const ans: boolean = this.remoteAccountManagerWrapper.ChangeUserInfo(this.token, info);
    if (ans) {
      this.invokeChangeHook();
    }
    return ans;
  }

  private changeHooks = [];
  subscribeAccountChange(func: () => void) {
    this.changeHooks.push(func);
  }
  private invokeChangeHook() {
    for (let f of this.changeHooks) {
      try {
        f();
      } catch (err) {
        console.warn(err);
      }
    }
  }
}
