import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountManageService, RESET_PASSWORD_AUTHCODE_TOKEN, RESET_PASSWORD_TOKEN } from 'src/app/shared/service/account-manage.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';


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
    bad_password: false
  };
  private resetError() {
    this.mError.bad_phone = false;
    this.mError.bad_code = false;
    this.mError.bad_password = false;
  }

  getVerificationCodeWait: number = 0;
  sendCode() {
    this.resetError();
    this.mAuthCodeToken = this.accountService.resetPasswordRequest(this.mAccountInfo.phone);
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
      return;
    }
    this.mAuthCodeToken = null;
    this.gotoReset = true;
  }

  resetPassword() {
    if (this.gotoReset == false || this.mResetToken == null) {
      this.gotoReset = false;
      return null;
    }

    this.accountService.resetPasswordConfirm(this.mResetToken, this.mAccountInfo.password);
  }

  constructor(private accountService: AccountManageService) { }

  ngOnInit() {
  }
}
