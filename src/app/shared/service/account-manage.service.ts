/** 
 * 这个服务用于替代服务器数据库的作用，应该只被 Client Side 的用户管理调用
 */


import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { StaticValue } from '../static-value/static-value.module';
import { makeid } from '../utils/utils.module';
import { AuthenticationCodeService } from './authentication-code.service';
import * as MD5 from 'md5';
import * as utils from '../utils/utils.module';

const EMPTY_SIGNUP = new StaticValue.SignupDataModel();

const retrieve_message = "【生意专家】验证码: {code}, 5分钟有效";
const NewUserMessage =  '【生意专家】尊敬的用户，您的验证码: { code }.工作人员不会索取，请勿泄露。';

/** Authentication Code */
export type AUTHCODE_TOKEN = string;
type HASH    = string;
type ACCOUNT = string;
type TIME    = number;
class AuthCode {
    private static TOKENS: Map<AUTHCODE_TOKEN, [HASH, ACCOUNT, TIME]> = new
    Map<AUTHCODE_TOKEN, [HASH, ACCOUNT, TIME]>();
    private static MAX_VALID_TIME_SPAN_MS: number = 5 * 60 * 1000;
    private static TokenLength = 64;

    static newToken(): AUTHCODE_TOKEN {
        return makeid(AuthCode.TokenLength);
    }

    static add(token: AUTHCODE_TOKEN, hash: HASH, account: ACCOUNT): boolean {
        if(AuthCode.TOKENS.has(token)) return false;
        AuthCode.TOKENS.set(token, [hash, account, Date.now()]);
        return true;
    }

    static check(token: AUTHCODE_TOKEN, hash: HASH): ACCOUNT {
        if (!AuthCode.TOKENS.has(token))
            return null;
        const [prev_hash, account, time] = AuthCode.TOKENS.get(token);
        if (hash != prev_hash || (Date.now() - time) > AuthCode.MAX_VALID_TIME_SPAN_MS)
            return null;
        return account;
    }
}


@Injectable({
  providedIn: 'root'
})
export class AccountManageService {
    constructor(private localstorage: LocalStorageService,
                private authCodeService: AuthenticationCodeService) {}

    private saveNewLoginRecord(record: StaticValue.LoginRecord) {
        let records: StaticValue.LoginLog = 
            this.localstorage.get(StaticValue.LOGIN_LOG, []) as StaticValue.LoginLog;
        records.push(record);
        this.localstorage.set(StaticValue.LOGIN_LOG, records);
    }

    /**
     * 利用账户登陆, 唯一生成 LoginToken 的 API
     *
     * @param {string} user 用户名
     * @param {string} password 密码
     * @return {LoginToken} 用于向服务获取对应用户的信息
     * @memberof AccountManageService
     */
    public login(user: string, password: string): StaticValue.LoginToken {
        let user_db = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB()) as StaticValue.UserDB;
        let new_login_record = new StaticValue.LoginRecord();

        new_login_record.date = Date();
        new_login_record.email = user;
        new_login_record.phone = user;
        new_login_record.username = user;
        new_login_record.userid = 0;
        new_login_record.loginType = StaticValue.LoginType.Unkown;
        password = MD5(password);

        let loginSuccess = false;
        let logininfo: StaticValue.LoginInfo = null;
        for(let u of user_db.users) {
            if(u.shopName == user) {
                new_login_record.loginType = StaticValue.LoginType.LoginByUsername;
                if (u.password == password) {
                    loginSuccess = true;
                    logininfo = u;
                    break;
                }
            } else if (u.phone == user) {
                new_login_record.loginType = StaticValue.LoginType.LoginByPhone;
                if (u.password == password) {
                    loginSuccess = true;
                    logininfo = u;
                    break;
                }
            } else if (u.email == user) {
                new_login_record.loginType = StaticValue.LoginType.LoginByEmail;
                if (u.password == password) {
                    loginSuccess = true;
                    logininfo = u;
                    break;
                }
            }
        }

        new_login_record.success = loginSuccess;
        this.saveNewLoginRecord(new_login_record);
        if (loginSuccess) {
            const newToken = StaticValue.LOGIN_TOKEN + makeid(20);
            let tokens = this.localstorage.get(StaticValue.LOGIN_TOKENS, new StaticValue.LoginTokens());
            tokens[newToken] = [Date.now(), logininfo.userid, logininfo.password];
            this.localstorage.set(StaticValue.LOGIN_TOKENS, tokens);

            logininfo.password = "";
            return newToken;
        } else {
            return null;
        }
    }

    private checkLoginToken(loginToken: StaticValue.LoginToken): StaticValue.UserId {
        let tokens = this.localstorage.get(StaticValue.LOGIN_TOKENS, new StaticValue.LoginTokens()) as StaticValue.LoginTokens;
        if (tokens[loginToken] == null)
            return -1;

        const [time, uid] = tokens[loginToken];
        if ((Date.now() - time) > StaticValue.LoginKeepTimeSpan) {
            delete tokens[loginToken];
            this.localstorage.set(StaticValue.LOGIN_TOKENS, tokens);
            return -1;
        }

        tokens[loginToken] = [Date.now(), uid];
        this.localstorage.set(StaticValue.LOGIN_TOKENS, tokens);
        return uid;
    }

    /**
     * 获取当前登录用户的用户基本信息
     *
     * @param  {LoginToken} loginToken
     * @return {UserBasicInfo}  用户的基本信息
     * @memberof AccountManageService
     */
    public userBasicInfo(loginToken: StaticValue.LoginToken): StaticValue.UserBasicInfo {
        const uid = this.checkLoginToken(loginToken);
        if (uid < 0) return null;

        let info: StaticValue.LoginInfo = null;
        const users = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB()) as StaticValue.UserDB;
        for(let u of users.users) {
            if( u.userid == uid) {
                info = u;
            }
        }
        if(info == null) {
            console.warn("database error");
            return null;
        }

        let ans = new StaticValue.UserBasicInfo();
        utils.assignTargetEnumProp(info, ans);
        return ans;
    }

    /**
     * 用于获取用户的商品分类信息
     *
     * @param {StaticValue.LoginToken} token
     * @return {*}  {StaticValue.Category}
     * @memberof AccountManageService
     */
    public getCategory(token: StaticValue.LoginToken): StaticValue.Category {
        const uid = this.checkLoginToken(token);
        if (uid < 0) return null;

        const cats = this.localstorage.get(StaticValue.KEY_USER_CATEGORIES, new StaticValue.UsersCategories());
        return cats[uid] || new StaticValue.Category();
    }

    /**
     * 用于更新用户的商品信息
     *
     * @param {StaticValue.LoginToken} token
     * @param {StaticValue.Category} cat
     * @return {*}  {boolean}
     * @memberof AccountManageService
     */
    public setCategory(token: StaticValue.LoginToken, cat: StaticValue.Category): boolean {
        const uid = this.checkLoginToken(token);
        if (uid < 0) return false;

        let cats = this.localstorage.get(StaticValue.KEY_USER_CATEGORIES, new StaticValue.UsersCategories());
        cats[uid] = cat;
        this.localstorage.set(StaticValue.KEY_USER_CATEGORIES, cats);
        return true;
    }

    /**
     * 不可用 ChangeUserInfo() 更改的属性, 在没有验证码的情况下
     *
     * @private
     * @memberof AccountManageService
     */
    private priviledgeProperties = ['phone', 'email', 'createTime'];

    /**
     * 更改用户的信息
     *
     * @param {StaticValue.LoginToken} token
     * @param {StaticValue.UserBasicInfo} info
     * @return {*}  {boolean}
     * @memberof AccountManageService
     */
    public ChangeUserInfo(token: StaticValue.LoginToken, info: StaticValue.UserBasicInfo, authCodeToken: AUTHCODE_TOKEN = null, authCode: string = null): boolean {
        const uid = this.checkLoginToken(token);
        if (uid < 0) return null;
        const prev_account = authCodeToken && authCode && AuthCode.check(authCodeToken, MD5(authCode));

        const db = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB()) as StaticValue.UserDB;
        for(let u of db.users) {
            if(u.userid == uid) {
                info.createTime = u.createTime;
                for (let prop of this.priviledgeProperties) {
                    if (info[prop] != u[prop] && prev_account != u.phone && prev_account != u.email) {
                        return false;
                    }
                }
                if (u.shopName != info.shopName && this.hasName(info.shopName)) {
                    return false;
                }
                if(info.phone != u.phone && this.hasPhone(info.phone)) {
                    return false;
                }
                if(info.email != u.email && this.hasEmail(info.email)) {
                    return false;
                }
                utils.CopySourceEnumProp(info, u);
                this.localstorage.set(StaticValue.USERDB_KEY, db);
                return true;
            }
        }

        return false;
    }

    /**
     * 更改当前用户密码
     *
     * @param {UserId} token Identify
     * @param {string} __old 旧密码
     * @param {string} __new 新密码
     * @return {*}
     * @memberof AccountManageService
     */
    public changePassword(token: StaticValue.LoginToken, __old: string, __new: string): boolean {
        const uid = this.checkLoginToken(token);
        if(uid < 0) return false;

        let oldmd5 = MD5(__old);
        let newmd5 = MD5(__new);

        let user_db = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB()) as StaticValue.UserDB;
        for(let u of user_db.users) {
            if(u.userid == uid) {
                if(u.password == oldmd5) {
                    u.password = newmd5;
                    this.localstorage.set(StaticValue.USERDB_KEY, user_db);
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

   /**
     * 请求短信验证码，该验证码可以用于后面的要求权限的操作
     * 
     * @param {string} phone
     * @return {*}  {[AUTHCODE_TOKEN, HASH]}
     * @memberof AccountManageService
     */
    public authenticationCodeRequest(phone: string): [AUTHCODE_TOKEN, HASH] {
        if (!this.hasPhone(phone)) {
            return null;
        }

        const token = AuthCode.newToken();
        const md5 = this.authCodeService.NewVerificode(retrieve_message, phone);
        AuthCode.add(token, md5, phone);

        return [token, md5];
    }

   /**
     * 发送用于重置密码的验证码到指定手机号码, 
     * 并返回用于重置该手机号码的验证 Token 以及验证码的 Hash 值
     *
     * @param {string} phone
     * @return {*}  {[AUTHCODE_TOKEN, HASH]}
     * @memberof AccountManageService
     */
    public resetPasswordRequest(phone: string): [AUTHCODE_TOKEN, HASH] {
        return this.authenticationCodeRequest(phone);
    }

    /**
     * 利用之前返回的 Token 重置密码
     *
     * @param {AUTHCODE_TOKEN} token
     * @param {ACCOUNT} account 发送验证码的账户
     * @param {string} code     验证码
     * @param {string} password 重置的密码
     * @memberof AccountManageService
     */
    public resetPasswordConfirm(token: AUTHCODE_TOKEN, account: ACCOUNT, code: string, password: string): boolean {
        const prev_account = AuthCode.check(token, MD5(code));
        if (!account || prev_account != account) {
            return false;
        }

        let userdb: StaticValue.UserDB = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB());
        for(let u of userdb.users) {
            if(u.phone == account) {
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
    public hasName(name: string): boolean {
        // TODO
        return this.testOccupy("shopName", name);
    }

    /**
     * 测试电话号码是否被占用
     *
     * @param {string} email
     * @memberof AccountManageService
     */
    public hasEmail(email: string): boolean {
        return this.testOccupy("email", email);
    }

    /**
     * 测试邮箱是否已被占用
     *
     * @param {string} phone
     * @memberof AccountManageService
     */
    public hasPhone(phone: string): boolean {
        return this.testOccupy("phone", phone);
    }

    /**
     * 请求注册新用户的验证码
     *
     * @param {string} phone
     * @return {*}  {[AUTHCODE_TOKEN, HASH]}
     * @memberof AccountManageService
     */
    public newUserRequest(phone: string): [AUTHCODE_TOKEN, HASH] {
        if (this.hasPhone(phone)) {
            return null;
        }
        const md5 = this.authCodeService.NewVerificode(NewUserMessage, phone);
        const token = AuthCode.newToken();
        AuthCode.add(token, md5, phone);
        return [token, md5];
    }

   /**
     * 增加新用户, 唯一添加新用户的 API
     *
     * @param {AUTHCODE_TOKEN} token
     * @param {StaticValue.SignupDataModel} user
     * @return {*}  {boolean}
     * @memberof AccountManageService
     */
    public addUser(token: AUTHCODE_TOKEN, user: StaticValue.SignupDataModel): boolean {
        const account = AuthCode.check(token, MD5(user.code));
        if (!account || (account != user.phone && account != user.email)) {
            return false;
        }

        if(this.hasName (user.shopName)) return false;
        if(this.hasEmail(user.email)) return false;
        if(this.hasPhone(user.phone)) return false;

        let userdb = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB) as StaticValue.UserDB;
        let new_user = new StaticValue.LoginInfo();
        utils.assignTargetEnumProp(user, new_user);

        let uid = 0;
        for(let u of userdb.users) {
            if (u.userid >= uid)
                uid = u.userid + 1;
        }
        new_user.password = MD5(user.password);
        new_user.userid = uid;
        new_user.createTime = Date.now();
        userdb.users.push(new_user);
        this.localstorage.set(StaticValue.USERDB_KEY, userdb);
        return true;
    }

    /**
     * 删除登录 Token
     *
     * @param {LoginToken} token
     *
     * @memberof AccountManageService
     */
    public removeLoginToken(token: StaticValue.LoginToken): void {
        let tokens = this.localstorage.get(StaticValue.LOGIN_TOKENS, new StaticValue.LoginTokens()) as StaticValue.LoginTokens;
        if(tokens[token] != null) {
            delete tokens[token];
            this.localstorage.set(StaticValue.LOGIN_TOKENS, tokens);
        } else {
            return;
        }
    }
}

