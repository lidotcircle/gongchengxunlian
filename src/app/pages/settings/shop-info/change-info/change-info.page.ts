import { Component, OnInit } from '@angular/core';
import { assert } from 'console';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

@Component({
  selector: 'app-change-info',
  templateUrl: './change-info.page.html',
  styleUrls: ['./change-info.page.scss'],
})
export class ChangeInfoPage implements OnInit {
  userinfo: StaticValue.UserBasicInfo;
  headerTitle: string;
  field: string;

  constructor(private accountManager: ClientAccountManagerService) {
    accountManager.userinfo().then(v => {
      this.userinfo = v;
      if (this.userinfo[this.field] == null) {
        throw new Error("bad field name");
      }
    });
  }

  submit() {
    const r = this.accountManager.updateUserInfo(this.userinfo);
  }

  ngOnInit() {
  }
}

