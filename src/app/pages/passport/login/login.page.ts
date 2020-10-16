import { StaticValue } from './../../../shared/static-value/static-value.module';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountManageService } from 'src/app/shared/service/account-manage.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
    private mLoginInfo: StaticValue.SignupDataModel = new StaticValue.SignupDataModel();

    constructor(private accountService: AccountManageService,
                private localstorage: LocalStorageService,
                private router: Router) {}

    ngOnInit() {
    }

    loginFail: boolean = false;
    loginSuccess: boolean = false;
    login_with_account(): boolean {
        this.loginFail = false;
        let token = this.accountService.login(this.mLoginInfo.shopName, this.mLoginInfo.password);
        if (!token) {
            this.loginFail = true;
            return false;
        }
        this.localstorage.set(StaticValue.LOGIN_TOKEN, token);
        this.loginSuccess = true;
        window.setTimeout(() => {
            this.router.navigateByUrl(StaticValue.URLS.HOME);
        }, 2000);
        return true;
    }
}

