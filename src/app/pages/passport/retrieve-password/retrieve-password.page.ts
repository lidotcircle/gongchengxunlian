import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountManageService, RESET_PASSWORD_AUTHCODE_TOKEN, RESET_PASSWORD_TOKEN } from 'src/app/shared/service/account-manage.service';
import { MenuController } from '@ionic/angular';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import * as utils from '../../../shared/utils/utils.module';


@Component({
    selector: 'app-retrieve-password',
    templateUrl: './retrieve-password.page.html',
    styleUrls: ['./retrieve-password.page.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RetrievePasswordPage implements OnInit {
    mAccountInfo: StaticValue.SignupDataModel = new StaticValue.SignupDataModel();
    mAuthCodeToken: RESET_PASSWORD_AUTHCODE_TOKEN = null;
    mResetToken: RESET_PASSWORD_TOKEN = null;
    mError = {
        bad_phone: false,
        bad_code: false,
        bad_password: false,
        reset_fail: false
    };
    private resetError() {
        this.mError.bad_phone = false;
        this.mError.bad_code = false;
        this.mError.bad_password = false;
    }

    getVerificationCodeWait: number = 0;
    sendCode() {
        this.resetError();
        this.mAuthCodeToken = this.accountService.resetPasswordRequest(this.mAccountInfo.shopName);
        if (this.mAuthCodeToken == null) {
            this.mError.bad_phone = true;
            return;
        }

        this.getVerificationCodeWait = StaticValue.VerificationCodeWait;
        this.getVerificationCodeWait++;
        let wait = () => {
            if (this.getVerificationCodeWait == 0)
                return;
            this.getVerificationCodeWait--;
            window.setTimeout(wait, 1000);
        }
        wait();
    }

    gotoReset: boolean = false;
    checkVerifyCode() {
        if (this.mAuthCodeToken == null) {
            this.mError.bad_phone = true;
            return;
        }
        this.mResetToken = this.accountService.resetPasswordAuthCodeCheck(this.mAuthCodeToken, this.mAccountInfo.code);
        if (this.mResetToken == null) {
            this.mError.bad_code = true;
            console.log("asdf")
            return;
        }
        this.mAuthCodeToken = null;
        this.gotoReset = true;
    }

    validatePassword(): string {
        if (utils.validation.validPassword(this.mAccountInfo.password)) {
            return utils.validation.MatchAll;
        } else {
            return utils.validation.NotMatch;
        }
    }

    resetSuccess: boolean = false;
    resetPassword() {
        if (this.gotoReset == false || this.mResetToken == null) {
            this.gotoReset = false;
            return null;
        }

        const rs = this.accountService.resetPasswordConfirm(this.mResetToken, this.mAccountInfo.password);
        if (rs) {
            this.resetSuccess = true;
        } else {
            this.mError.reset_fail = true;
        }
    }

    constructor(private accountService: AccountManageService,
                private menu: MenuController) { }

    ionViewWillEnter() {
        this.menu.enable(false);
    }

    ionViewDidLeave() {
        this.menu.enable(true);
    }

    ngOnInit() {
    }
}
