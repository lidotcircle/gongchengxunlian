/** constants string and symbol */

export module StaticValue {
    /** local storage keys */
    export const APP_KEY = 'APP';
    export const APP_VERSION = '1.0.0';
    export const LOGIN_TOKEN = "LOGIN_TOKEN";

    /** database keys */
    export const LOGIN_LOG = "LOGIN_LOG";
    export const USERDB_KEY = 'USER_DATABASE';
    export const LOGIN_TOKENS = "LOGIN_TOKENS";
    export const KEY_USER_CATEGORIES = "USER_CATEGORIES";
    export const KEY_UESR_PRODUCTS = "USER_PRODUCSTS";

    /** session storage keys */
    export const SIGNUP_INFO = 'SIGNUP_INFO';
    export const SIGNUP_MD5 = 'SIGNUP_MD5';


    /** time to wait for a new verificatioin code */
    export const VerificationCodeWait = 5;

    /** time to valid login */
    export const LoginKeepTimeSpan = (5 * 24 * 60 * 60 * 1000);

    export class AppConfig {
        isLaunched: boolean = false;
        version: string = APP_VERSION;
    };

    export module MSG {
        export const MSG_ID = '__message__';
    }

   export module URLS {
        export const HOME    = 'default';
        export const WELCOME = 'welcome';
        export const SIGNIN  = 'passport/login';
        export const SIGNUP  = 'passport/signup';
        export const SETTING = 'settings';
    }

    export class UserBasicInfo {
        phone: string    = '';
        email: string    = '';
        shopName: string = '';
        nickname: string = '';
        shopOwnerName: string = '';
        shopPhone: string = '';
        shopType: string = '';
        createTime: number = 0;
    }

    export class SignupDataModel extends UserBasicInfo {
        password: string = '';
        confirmPassword: string = '';
        code: string = '';
    }

    /** login log */
    export enum LoginType {
        LoginByUsername = "LOGIN_BY_USERNAME",
        LoginByPhone = "LOGIN_BY_PHONE",
        LoginByEmail = "LOGIN_BY_EMAIL",
        Unkown = "LOGIN_UNKONW"
    }
    export type UserId = number;
    export class LoginRecord {
        loginType: LoginType = LoginType.Unkown;

        userid: UserId = -1;
        email: string = '';
        phone: string = '';
        username: string = '';

        date: string = '';
        success: boolean = false;
    }
    export type LoginLog = LoginRecord[];

    /** user infomation saved in database */
    export class LoginInfo extends UserBasicInfo {
        userid: number = -1;
        password: string = '';
    }
    export class UserDB {
        users: LoginInfo[] = [];
    };

    export type LoginToken  = string;
    export class LoginTokens {
        [token: string]: [number, UserId]
    }

    export class Category {
        id: number = -1;
        name: string = '';
        children: Category[] = [];
    }

    export class UsersCategories {
        [key: number]: Category;
    }

    export class Product {
        productId: number = -1;
        productName: string = '';
        categoryId: number = 0; // DEFAULT
        barCode: string = '';
        photos: string[] = [];
        class: string = '';
        salePrice: number = null;
        originalPrice: number = null;
        remainCount: number = null;
        specification: string = '';
        remarks: string = '';
    }

    export class UserProducts {
        [key: number]: Product[];
    }
}

