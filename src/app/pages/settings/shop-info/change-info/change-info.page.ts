import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import * as utils from '../../../../shared/utils/utils.module';

@Component({
  selector: 'app-change-info',
  templateUrl: './change-info.page.html',
  styleUrls: ['./change-info.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeInfoPage implements OnInit {
  userinfo: StaticValue.UserBasicInfo;
  headerTitle: string;
  field: string;
  value: string;

  constructor(private accountManager: ClientAccountManagerService,
              private router: ActivatedRoute,
              private toast: ToastController) {
    this.router.queryParams.subscribe(params => {
      this.headerTitle = params["headerTitle"];
      this.field = params["field"];

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
    const ans = await this.accountManager.updateUserInfo(this.userinfo);
    this.toast.create({
      message: (ans ? '保存成功' : '保存失败!'),
      duration: 2000,
      position: 'bottom'
    }).then(t => t.present());
  }

  valueChanged(val) {
    this.userinfo[this.field] = val;
  }

  ngOnInit() {
  }
}

