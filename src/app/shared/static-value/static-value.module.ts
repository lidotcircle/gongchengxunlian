/** constants string and symbol */

export module StaticValue {

    export const APP_KEY = 'APP';
    export const LOGIN_KEY = 'LOGIN_INFO';
    export const USERDB_KEY = 'USER_DATABASE';
    export const APP_VERSION = '1.0.0';

    export class AppConfig {
        isLaunched: boolean = false;
        version: string = APP_VERSION;
    };

    export class LoginInfo {
        username: string = null;
        password: string = null;
    };

    export class UserDB {
        users: LoginInfo[] = [];
    };

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
    }
}
