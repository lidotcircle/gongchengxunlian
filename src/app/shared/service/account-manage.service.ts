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
const MAX_VALID_TIME_SPAN_MS: number = 5 * 60 * 1000;
export type RESET_PASSWORD_AUTHCODE_TOKEN = string
const RESET_PASSWORD_AUTHCODE_TOKENS: Map<RESET_PASSWORD_AUTHCODE_TOKEN, [number, string, string]> =
        new Map<RESET_PASSWORD_AUTHCODE_TOKEN, [number, string, string]>();
export type RESET_PASSWORD_TOKEN = string;
const RESET_PASSWORD_TOKENS: Map<RESET_PASSWORD_TOKEN, string> =
        new Map<RESET_PASSWORD_TOKEN, string>();

const NewUserMessage =  '【生意专家】尊敬的用户，您的验证码: { code }.工作人员不会索取，请勿泄露。';
export type NEW_USER_AUTHCODE_TOKEN = string;
/**                                                           MD5     PHONE   TIME */
const NEW_USER_AUTHCODE_TOKENS: Map<NEW_USER_AUTHCODE_TOKEN, [string, string, number]> = new
    Map<NEW_USER_AUTHCODE_TOKEN, [string, string, number]>();

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
     * 不可用 ChangeUserInfo() 更改的属性
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
    public ChangeUserInfo(token: StaticValue.LoginToken, info: StaticValue.UserBasicInfo): boolean {
        const uid = this.checkLoginToken(token);
        if (uid < 0) return null;

        const db = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB()) as StaticValue.UserDB;
        for(let u of db.users) {
            if(u.userid == uid) {
                for (let prop of this.priviledgeProperties) {
                    if (info[prop] != u[prop]) {
                        return false;
                    }
                }
                if (u.shopName != info.shopName && this.hasName(info.shopName)) {
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
     * @param {UserId} userid Identify
     * @param {string} __old 旧密码
     * @param {string} __new 新密码
     * @return {*}
     * @memberof AccountManageService
     */
    public changePassword(userid: StaticValue.UserId, __old: string, __new: string): any {
        let oldmd5 = MD5(__old);
        let newmd5 = MD5(__new);

        let user_db = this.localstorage.get(StaticValue.USERDB_KEY, new StaticValue.UserDB()) as StaticValue.UserDB;
        for(let u of user_db.users) {
            if(u.userid == userid) {
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
     * @return {*}  {[NEW_USER_AUTHCODE_TOKEN, string]}
     * @memberof AccountManageService
     */
    public newUserRequest(phone: string): [NEW_USER_AUTHCODE_TOKEN, string] {
        if (this.hasPhone(phone)) {
            return null;
        }
        const md5 = this.authCodeService.NewVerificode(NewUserMessage, phone);
        const token = "NEW_USER_TOKEN-" + makeid(20);
        const current = Date.now();
        NEW_USER_AUTHCODE_TOKENS.set(token, [md5, phone, current]);
        return [token, md5];
    }

   /**
     * 增加新用户, 唯一添加新用户的 API
     *
     * @param {NEW_USER_AUTHCODE_TOKEN} token
     * @param {StaticValue.SignupDataModel} user
     * @return {*}  {boolean}
     * @memberof AccountManageService
     */
    public addUser(token: NEW_USER_AUTHCODE_TOKEN, user: StaticValue.SignupDataModel): boolean {
        const entry = NEW_USER_AUTHCODE_TOKENS.get(token);
        if (!entry || (Date.now() - entry[2]) > MAX_VALID_TIME_SPAN_MS
                   || MD5(user.code) != entry[0]
                   || (entry[1] != user.phone && entry[1] != user.email)) {
            NEW_USER_AUTHCODE_TOKENS.delete(token);
            return false;
        }
        NEW_USER_AUTHCODE_TOKENS.delete(token);

        if(this.hasName(user.shopName)) return false;
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

