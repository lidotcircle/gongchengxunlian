import { ClientAccountManagerService } from './../../../shared/service/client-account-manager.service';
import { ToastController } from '@ionic/angular';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as utils from '../../../shared/utils/utils.module';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordPage implements OnInit {

  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  constructor(private accountManager: ClientAccountManagerService,
              private toast: ToastController) { }

  validate_pass(value) {
    return utils.validation.validPassword(value) ? utils.validation.MatchAll : utils.validation.NotMatch;
  }

  async submit() {
    const ans = await this.accountManager.changePassword(this.oldPassword, this.newPassword);
    this.toast.create({
      message: (ans ? '保存成功' : '保存失败!'),
      duration: 2000,
      position: 'bottom'
    }).then(t => t.present());
  }

  ngOnInit() {
  }

}
