import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { LoginInfo, UserDB } from '../static-value/static-value.module';
import * as StaticValue from '../static-value/static-value.module';

@Injectable({
  providedIn: 'root'
})
export class LoginInfoService {
    constructor(private localstorage: LocalStorageService, private router: Router) {}
    private update_user(user: LoginInfo) {
        let user_db = this.localstorage.get(StaticValue.USERDB_KEY, new UserDB()) as UserDB;
        for(let i in user_db.users) {
            if(user_db.users[i].username == user.username) {
                user_db.users[i].password = user.password;
                this.localstorage.set(StaticValue.USERDB_KEY, user_db);
                return;
            }
        }
        user_db.users.push(user);
        this.localstorage.set(StaticValue.USERDB_KEY, user_db);
    }

    public login(): boolean {
        let user = this.localstorage.get(StaticValue.LOGIN_KEY, new LoginInfo()) as LoginInfo;
        let user_db = this.localstorage.get(StaticValue.USERDB_KEY, new UserDB()) as UserDB;

        if(user.username == null || user.password == null) {
            return false;
        }
        for(let u of user_db.users) {
            if(u.username == user.username) {
                if(u.password == user.password) return true;
                this.localstorage.remove(StaticValue.LOGIN_KEY);
            }
        }

        return false;
    }

    public username(): string {
        let user = this.localstorage.get(StaticValue.LOGIN_KEY, new LoginInfo()) as LoginInfo;
        return user.username;
    }

    public changePassword(__old: string, __new: string) {
        if(!this.login()) return;
        let user = this.localstorage.get(StaticValue.LOGIN_KEY, new LoginInfo()) as LoginInfo;
        if(user.username == null) {
            /** require debug */
            return;
        }
        if(user.password == __old) {
            user.password = __new;
            this.localstorage.set(StaticValue.LOGIN_KEY, user);
            this.update_user(user);
        }
    }

    public hasName(name: string) {
        let userdb = this.localstorage.get(StaticValue.USERDB_KEY, new UserDB) as UserDB;
        for(let user of userdb.users) {
            if(user.username == name) return false;
        }
        return false;
    }

    public addUser(user: LoginInfo): boolean {
        if(this.hasName(user.username)) return false;
        let userdb = this.localstorage.get(StaticValue.USERDB_KEY, new UserDB) as UserDB;
        let new_user = Object.assign({}, user);
        userdb.users.push(new_user);
        return true;
    }

    public removeLoginInfo() {
        this.localstorage.remove(StaticValue.LOGIN_KEY);
        this.router.navigateByUrl('login');
    }
}

