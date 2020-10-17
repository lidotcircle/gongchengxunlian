import { StaticValue } from './../../../shared/static-value/static-value.module';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountManageService } from 'src/app/shared/service/account-manage.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { ToastController, MenuController } from '@ionic/angular';

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
                private router: Router,
                private toast: ToastController,
                private menu: MenuController) {}

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.menu.enable(false);
    }

    ionViewDidLeave() {
        this.menu.enable(true);
    }

    loginFail: boolean = false;
    loginSuccess: boolean = false;
    inToast: boolean = false;
    async login_with_account(): Promise<boolean> {
        if(this.inToast || this.loginSuccess) return false;

        this.loginFail = false;
        let token = this.accountService.login(this.mLoginInfo.shopName, this.mLoginInfo.password);
        if (!token) {
            // this.loginFail = true;
            this.inToast = true;
            let r = await this.toast.create({
                message: "登录失败，密码或者用户名错误",
                duration: 2000,
                position: 'top'
            });
            r.present().then(() => this.inToast = false);
            return false;
        }
        this.localstorage.set(StaticValue.LOGIN_TOKEN, token);
        this.loginSuccess = true;
        window.setTimeout(() => {
            this.router.navigateByUrl(StaticValue.URLS.HOME);
        }, 1000);
        return true;
    }
}

