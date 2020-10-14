import { StaticValue } from './../../../shared/static-value/static-value.module';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountManageService } from 'src/app/shared/service/account-manage.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
  private mLoginInfo: StaticValue.SignupDataModel = new StaticValue.SignupDataModel();

  constructor(private accountService: AccountManageService, private localstorage: LocalStorageService) {}

  ngOnInit() {
  }

  loginFail: boolean = false;
  try_login(): boolean {
    if (this.mLoginInfo.shopName.length > 0) {
      this.mLoginInfo.phone = this.mLoginInfo.shopName;
      this.mLoginInfo.email = this.mLoginInfo.shopName;
      this.mLoginInfo.userid = 0;
      this.localstorage.set(StaticValue.LOGIN_KEY, this.mLoginInfo);
    }

    if (!this.accountService.login()) {
      if(this.mLoginInfo.shopName.length > 0) {
        this.loginFail = true;
      }
      this.localstorage.remove(StaticValue.LOGIN_KEY);
      return false;
    }
    return true;
  }

}
