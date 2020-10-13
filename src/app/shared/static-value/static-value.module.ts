/** constants string and symbol */

export module StaticValue {

    export const APP_KEY = 'APP';
    export const LOGIN_KEY = 'LOGIN_INFO';
    export const USERDB_KEY = 'USER_DATABASE';
    export const APP_VERSION = '1.0.0';
    export const SIGNUP_INFO = 'SIGNUP_INFO';
    export const SIGNUP_MD5 = 'SIGNUP_MD5';
    export const LOGIN_LOG = "LOGIN_LOG";

    export const VerificationCodeWait = 5;

    export class AppConfig {
        isLaunched: boolean = false;
        version: string = APP_VERSION;
    };

    export module MSG {
        export const MSG_ID = '__message__';
    }

   export module URLS {
        export const HOME = 'home';
        export const WELCOME = 'welcome';
        export const SIGNIN = 'passport/login';
        export const SIGNUP = 'passport/signup';
    }

    export class SignupDataModel {
        phone: string = '';
        email: string = '';
        shopName: string = '';
        password: string = '';
        confirmPassword: string = '';
        code: string = '';
        userid: number = -1;
        createTime: string = '';
    }

    export enum LoginType {
        LoginByUsername = "LOGIN_BY_USERNAME",
        LoginByPhone = "LOGIN_BY_PHONE",
        LoginByEmail = "LOGIN_BY_EMAIL",
        Unkown = "LOGIN_UNKONW"
    }
    export class LoginRecord {
        loginType: LoginType = LoginType.Unkown;

        userid: number = -1;
        email: string = '';
        phone: string = '';
        username: string = '';

        date: string = '';
        success: boolean = false;
    }

    export type LoginLog = LoginRecord[];

    export class LoginInfo extends SignupDataModel {
    }

    export class UserDB {
        users: LoginInfo[] = [];
    };
}
