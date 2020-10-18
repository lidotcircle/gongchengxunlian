import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
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
    async sendCode() {
        this.resetError();

        this.getVerificationCodeWait = StaticValue.VerificationCodeWait;
        this.getVerificationCodeWait++;
        let wait = () => {
            if (this.getVerificationCodeWait == 0)
                return;
            this.getVerificationCodeWait--;
            window.setTimeout(wait, 1000);
        }

        const ans = await this.accountManager.resetPasswordRequest(this.mAccountInfo.shopName);
        wait();
        if (!ans) {
            this.mError.bad_phone = true;
            return;
        }
    }

    gotoReset: boolean = false;
    async checkVerifyCode() {
        const ans = await this.accountManager.resetPasswordAuthCodeCheck(this.mAccountInfo.code);
        if (!ans) {
            this.mError.bad_code = true;
            return;
        }
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
    async resetPassword() {
        if (this.gotoReset == false) {
            this.gotoReset = false;
            return false;
        }

        const ans = this.accountManager.resetPasswordConfirm(this.mAccountInfo.password);
        if (ans) {
            this.resetSuccess = true;
        } else {
            this.mError.reset_fail = true;
        }
    }

    constructor(private accountManager: ClientAccountManagerService) { }

    ngOnInit() {
    }
}
