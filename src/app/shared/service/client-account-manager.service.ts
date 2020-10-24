import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StaticValue } from '../static-value/static-value.module';
import { AccountManageService, AUTHCODE_TOKEN } from './account-manage.service';
import { LocalStorageService } from './local-storage.service';

export enum HookType {
    UserInfoChange,
    CategoriesChange
}

@Injectable({
  providedIn: 'root'
})
export class ClientAccountManagerService {
    private token: string = null;

    constructor(private localstorage: LocalStorageService,
                private remoteAccountManagerWrapper: AccountManageService,
                private router: Router,
                private location: Location) {
        this.token = this.localstorage.get(StaticValue.LOGIN_TOKEN, null);
    }

    private update() {
        this.token = this.localstorage.get(StaticValue.LOGIN_TOKEN, null);
    }

    async login(account: string, password: string): Promise<StaticValue.LoginToken> {
        const token = this.remoteAccountManagerWrapper.login(account, password);
        if (token) {
            this.localstorage.set(StaticValue.LOGIN_TOKEN, token);
            this.invokeHook(HookType.UserInfoChange);
        }
        return token;
    }

    async logout() {
        this.update();
        this.remoteAccountManagerWrapper.removeLoginToken(this.token);
        this.localstorage.remove(StaticValue.LOGIN_TOKEN);
        this.token = null;
        this.invokeHook(HookType.UserInfoChange);

        this.location.go('/');
        location.reload();
        this.all_hooks = new Map();
    }

    private authcode_token: AUTHCODE_TOKEN;
    private reset_account: string;
    async resetPasswordRequest(phone: string): Promise<string> {
        let md5 = null;
        [this.authcode_token, md5] = this.remoteAccountManagerWrapper.resetPasswordRequest(phone) || [null, null];
        this.reset_account = phone;
        return md5;
    }

    async resetPasswordConfirm(code: string, password: string): Promise<boolean> {
        if (!this.authcode_token) {
            return false;
        }
        const ans = this.remoteAccountManagerWrapper.resetPasswordConfirm(this.authcode_token, this.reset_account, code, password);
        this.authcode_token = null;
        this.reset_account = null;
        return ans;
    }

    private new_user_token: AUTHCODE_TOKEN;
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

    async getCategories(): Promise<StaticValue.Category> {
        this.update();
        return this.remoteAccountManagerWrapper.getCategory(this.token);
    }

    async setCategories(cats: StaticValue.Category): Promise<boolean> {
        this.update();
        const ans =  this.remoteAccountManagerWrapper.setCategory(this.token, cats);
        if(ans) this.invokeHook(HookType.CategoriesChange);
        return ans;
    }

    async updateUserInfo(info: StaticValue.UserBasicInfo): Promise<boolean> {
        this.update();
        const ans: boolean = this.remoteAccountManagerWrapper.ChangeUserInfo(this.token, info);
        if (ans) {
            this.invokeHook(HookType.UserInfoChange);
        }
        return ans;
    }

    async changePassword(__old: string, __new: string): Promise<boolean> {
        this.update();
        if(this.token == null) {
            return false;
        }
        return this.remoteAccountManagerWrapper.changePassword(this.token, __old, __new);
    }

    subscribeAccountChange(func: () => void) {
        this.subscribe(HookType.UserInfoChange, func);
    }

    private all_hooks = new Map<HookType, Array<{():void}>>();
    public subscribe(ht: HookType, func: () => void) {
        let hooks = this.all_hooks.get(ht) || [];
        hooks.push(func);
        this.all_hooks.set(ht, hooks);
    }

    private invokeHook(ht: HookType) {
        let hooks = this.all_hooks.get(ht) || [];
        for (let f of hooks) {
            try {
                f();
            } catch (err) {
                console.warn(err);
            }
        }
    }
}
