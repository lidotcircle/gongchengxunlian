import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { StaticValue } from '../static-value/static-value.module';
import * as MD5 from 'md5';
import { makeid } from '../utils/utils.module';
import { AuthenticationCodeService } from './authentication-code.service';

const EMPTY_SIGNUP = new StaticValue.SignupDataModel();

const retrieve_message = "【生意专家】验证码: {code}, 5分钟有效";
const MAX_VALID_TIME_SPAN_MS: number = 5 * 60 * 1000;
export type RESET_PASSWORD_AUTHCODE_TOKEN = string
const RESET_PASSWORD_AUTHCODE_TOKENS: Map<RESET_PASSWORD_AUTHCODE_TOKEN, [number, string, string]> =
        new Map<RESET_PASSWORD_AUTHCODE_TOKEN, [number, string, string]>();
export type RESET_PASSWORD_TOKEN = string;
const RESET_PASSWORD_TOKENS: Map<RESET_PASSWORD_TOKEN, string> =
        new Map<RESET_PASSWORD_TOKEN, string>();

@Injectable({
  providedIn: 'root'
})
export class AccountManageService {
    constructor(private localstorage: LocalStorageService,
                private authCodeService: AuthenticationCodeService,
                private router: Router) {}

    private update_user_password(user: StaticValue.LoginInfo) {
        let user_db = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB()) as StaticValue.UserDB;
        for(let i in user_db.users) {
            if(user_db.users[i].shopName == user.shopName) {
                user_db.users[i].password = user.password;
                this.localstorage.set(StaticValue.USERDB_KEY, user_db);
                return;
            }
        }
        user_db.users.push(user);
        this.localstorage.set(StaticValue.USERDB_KEY, user_db);
    }

    private saveNewLoginRecord(record: StaticValue.LoginRecord) {
        let records: StaticValue.LoginLog = 
            this.localstorage.get(StaticValue.LOGIN_LOG, []) as StaticValue.LoginLog;
        records.push(record);
        this.localstorage.set(StaticValue.LOGIN_LOG, records);
    }

    /**
     * 尝试登录，检测是否有有效的用户信息, TODO decouple login with localStorage or say database
     *
     * @return {*}  {boolean} 是否登录成功
     * @memberof AccountManageService
     */
    public login(): boolean {
        let user = this.localstorage.get(StaticValue.LOGIN_KEY, new StaticValue.LoginInfo()) as StaticValue.LoginInfo;
        if (user.userid < 0) {
            // TODO ???
            console.warn("login fail");
            return false;
        }

        let user_db = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB()) as StaticValue.UserDB;
        let new_login_record = new StaticValue.LoginRecord();

        new_login_record.date = Date();
        new_login_record.email = user.email;
        new_login_record.phone = user.phone;
        new_login_record.username = user.shopName;
        new_login_record.userid = user.userid;
        new_login_record.loginType = StaticValue.LoginType.Unkown;

        let loginSuccess = false;
        let logininfo: StaticValue.LoginInfo = null;
        for(let u of user_db.users) {
            if(u.shopName == user.shopName) {
                new_login_record.loginType = StaticValue.LoginType.LoginByUsername;
                if (u.password == user.password) {
                    loginSuccess = true;
                    logininfo = u;
                    break;
                }
                this.localstorage.remove(StaticValue.LOGIN_KEY);
            } else if (u.phone == user.phone) {
                new_login_record.loginType = StaticValue.LoginType.LoginByPhone;
                if (u.password == user.password) {
                    loginSuccess = true;
                    logininfo = u;
                    break;
                }
            } else if (u.email == user.email) {
                new_login_record.loginType = StaticValue.LoginType.LoginByEmail;
                if (u.password == user.password) {
                    loginSuccess = true;
                    logininfo = u;
                    break;
                }
            }
        }

        if(logininfo != null) {
            this.localstorage.set(StaticValue.LOGIN_KEY, logininfo);
        }
        this.saveNewLoginRecord(new_login_record);
        new_login_record.success = loginSuccess;
        return loginSuccess;
    }

    /**
     * 当前登录用户的用户名
     *
     * @return {*}  {string}
     * @memberof AccountManageService
     */
    public username(): string {
        let user = this.localstorage.get(StaticValue.LOGIN_KEY, new StaticValue.LoginInfo()) as StaticValue.LoginInfo;
        return user.shopName;
    }

    /**
     * 更改当前用户密码
     *
     * @param {string} __old 旧密码
     * @param {string} __new 新密码
     * @return {*}
     * @memberof AccountManageService
     */
    public changePassword(__old: string, __new: string): any {
        if(!this.login()) return;
        let oldmd5 = MD5(__old);
        let newmd5 = MD5(__new);
        let user = this.localstorage.get(StaticValue.LOGIN_KEY, new StaticValue.LoginInfo()) as StaticValue.LoginInfo;
        if(user.shopName == null) {
            /** require debug */
            console.warn("need debug");
            return;
        }
        if(user.password == oldmd5) {
            user.password = newmd5;
            this.localstorage.set(StaticValue.LOGIN_KEY, user);
            this.update_user_password(user);
        }
    }

    /**
     * 发送用于重置密码的验证码到指定手机号码, 
     * 并返回用于重置该手机号码的验证 Token
     *
     * @param {string} phone
     * @return {*}  {RESET_PASSWORD_AUTHCODE_TOKEN}
     * @memberof AccountManageService
     */
    public resetPasswordRequest(phone: string): RESET_PASSWORD_AUTHCODE_TOKEN {
        if (!this.hasPhone(phone)) {
            return null;
        }
        const token = makeid(30);
        const now = Date.now();
        const md5 = this.authCodeService.NewVerificode(retrieve_message, phone);

        RESET_PASSWORD_AUTHCODE_TOKENS.set(token, [now, phone, md5]);
        return token;
    }

    /**
     * 验证用户输入的验证码，如果正确返回一个重置该手机号账户密码的 Token
     *
     * @param {RESET_PASSWORD_AUTHCODE_TOKEN} token
     * @param {string} authcode
     * @return {*}  {RESET_PASSWORD_TOKEN}
     * @memberof AccountManageService
     */
    public resetPasswordAuthCodeCheck(token: RESET_PASSWORD_AUTHCODE_TOKEN, authcode: string): RESET_PASSWORD_TOKEN {
        if (!RESET_PASSWORD_AUTHCODE_TOKENS.has(token)) {
            return null;
        }

        let [time, phone, md5] = RESET_PASSWORD_AUTHCODE_TOKENS.get(token);
        if ((Date.now() - time) > MAX_VALID_TIME_SPAN_MS) {
            RESET_PASSWORD_AUTHCODE_TOKENS.delete(token);
            return null;
        }

        let newmd5 = MD5(authcode);
        if (newmd5 != md5) {
            return null;
        }

        RESET_PASSWORD_AUTHCODE_TOKENS.delete(token);
        let new_token = makeid(20);

        RESET_PASSWORD_TOKENS.set(new_token, phone);
        return new_token;
    }

    /**
     * 利用之前返回的 Token 重置密码
     *
     * @param {RESET_PASSWORD_TOKEN} token
     * @param {string} password
     * @memberof AccountManageService
     */
    public resetPasswordConfirm(token: RESET_PASSWORD_TOKEN, password: string): boolean {
        if (!RESET_PASSWORD_TOKENS.has(token)) {
            return false;
        }

        let phone = RESET_PASSWORD_TOKENS.get(token);
        RESET_PASSWORD_TOKENS.delete(token);
        let userdb: StaticValue.UserDB = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB());
        for(let u of userdb.users) {
            if(u.phone == phone) {
                u.password = MD5(password);
                this.localstorage.set(StaticValue.USERDB_KEY, userdb);
                return true;
            }
        }

        console.warn("unknow error");
        return false;
    }

    /**
     * 测试占用情况
     *
     * @private
     * @param {string} field 属性名
     * @param {string} value 值
     * @return {*} 
     * @memberof AccountManageService
     */
    private testOccupy(field: string, value: string) {
        if (Object.keys(EMPTY_SIGNUP).indexOf(field) == -1) {
            console.error("bad property name");
            return false;
        }
        let userdb = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB) as StaticValue.UserDB;
        for(let user of userdb.users) {
            if(user[field] == value) 
                return true;
        }
        return false;
    }

    /**
     * 测试是否用户名被占用
     *
     * @param {string} name 检测的用户名
     * @return {*} 
     * @memberof AccountManageService
     */
    public hasName(name: string) {
        // TODO
        return this.testOccupy("shopName", name);
    }

    /**
     * 测试电话号码是否被占用
     *
     * @param {string} email
     * @memberof AccountManageService
     */
    public hasEmail(email: string) {
        return this.testOccupy("email", email);
    }

    /**
     * 测试邮箱是否已被占用
     *
     * @param {string} phone
     * @memberof AccountManageService
     */
    public hasPhone(phone: string) {
        return this.testOccupy("phone", phone);
    }

    /**
     * 增加新用户, 唯一添加新用户的 API
     *
     * @param {StaticValue.LoginInfo} user 用户信息
     * @return {*}  {boolean} 是否成功
     * @memberof AccountManageService
     */
    public addUser(user: StaticValue.LoginInfo): boolean {
        if(this.hasName(user.shopName)) return false;
        if(this.hasEmail(user.email)) return false;
        if(this.hasPhone(user.phone)) return false;

        let userdb = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB) as StaticValue.UserDB;
        let new_user = Object.assign({}, user);
        let uid = 0;
        for(let u of userdb.users) {
            if (u.userid >= uid)
                uid = u.userid + 1;
        }
        new_user.confirmPassword = "";
        new_user.password = MD5(user.password);
        new_user.code = "";
        new_user.userid = uid;
        new_user.createTime = window.Date();
        userdb.users.push(new_user);
        this.localstorage.set(StaticValue.USERDB_KEY, userdb);
        return true;
    }

    /**
     * 登出当前用户, 引导至首页
     *
     * @memberof AccountManageService
     */
    public removeLoginInfo() {
        this.localstorage.remove(StaticValue.LOGIN_KEY);
        this.router.navigateByUrl('');
    }
}

