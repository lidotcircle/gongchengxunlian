/** constants string and symbol */

export const APP_KEY = 'APP';
export const LOGIN_KEY = 'LOGIN_INFO';
export const USERDB_KEY = 'USER_DATABASE';
export const APP_VERSION = '1.0.0';

export class AppConfig {
    hasRun: boolean = false;
    version: string = APP_VERSION;
};

export class LoginInfo {
    username: string = null;
    password: string = null;
};

export class UserDB {
    users: LoginInfo[] = [];
};

