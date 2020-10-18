import { StaticValue } from './../../../shared/static-value/static-value.module';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
    public mLoginInfo: StaticValue.SignupDataModel = new StaticValue.SignupDataModel();

    constructor(private accountManager: ClientAccountManagerService,
                private router: Router,
                private toast: ToastController) {}

    ngOnInit() {
    }

    loginFail: boolean = false;
    loginSuccess: boolean = false;
    inToast: boolean = false;
    async login_with_account(): Promise<boolean> {
        if(this.inToast || this.loginSuccess) return false;

        this.loginFail = false;
        const token = await this.accountManager.login(this.mLoginInfo.shopName, this.mLoginInfo.password);
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
        this.loginSuccess = true;
        window.setTimeout(() => {
            this.router.navigateByUrl(StaticValue.URLS.HOME);
        }, 1000);
        return true;
    }
}

