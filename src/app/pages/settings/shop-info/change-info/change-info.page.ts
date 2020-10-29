import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import * as utils from '../../../../shared/utils/utils.module';
import * as MD5 from 'md5';

@Component({
  selector: 'app-change-info',
  templateUrl: './change-info.page.html',
  styleUrls: ['./change-info.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeInfoPage implements OnInit, AfterViewChecked {
  userinfo: StaticValue.UserBasicInfo;
  headerTitle: string;
  field: string;
  value: string;
  auth:  boolean;
  code: string = '';
  authMd5: string = '';

  constructor(private accountManager: ClientAccountManagerService,
              private router: ActivatedRoute,
              private toast: ToastController,
              private cdRef: ChangeDetectorRef) {
    this.router.queryParams.subscribe(params => {
      this.headerTitle = params["headerTitle"];
      this.field = params["field"];
      this.auth  = !!params["auth"];

      const update__ = () => {
        this.accountManager.userinfo().then(v => {
          this.userinfo = v;
          if (this.userinfo[this.field] == null) {
            throw new Error("bad field name");
          }
          this.value = this.userinfo[this.field];
        });
      };

      this.accountManager.subscribeAccountChange(update__);
      update__();
    });
  }

  validate() {
    const func = utils.validation.validationMap.get(this.field);
    if (!func) {
      throw new Error(`bad validate function for ${this.field}`);
    }
    if(func(this.value)){
      return utils.validation.MatchAll;
    } else {
      return utils.validation.NotMatch;
    }
  }

  async submit() {
    const ans = await this.accountManager.updateUserInfo(this.userinfo, this.code);
    this.toast.create({
      message: (ans ? '保存成功' : '保存失败!'),
      duration: 2000,
      position: 'bottom'
    }).then(t => t.present());
  }

  valueChanged(val) {
    this.userinfo[this.field] = val;
  }

  getVerificationCodeWait: number = 0;
  async newVerification() {
    this.getVerificationCodeWait = StaticValue.VerificationCodeWait;
    this.getVerificationCodeWait++;
    const u = () => {
      this.getVerificationCodeWait--;
      if(this.getVerificationCodeWait>0) {
        setTimeout(() => u(), 1000);
      }
    }
    this.authMd5 = await this.accountManager.authticationCodeRequest(this.userinfo.phone);
    u();
  }

  testVerifyCode() {
    const md5 = MD5(this.code);
    return (md5 == this.authMd5) ? utils.validation.MatchAll : utils.validation.NotMatch;
  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.cdRef.detectChanges();
  }
}
