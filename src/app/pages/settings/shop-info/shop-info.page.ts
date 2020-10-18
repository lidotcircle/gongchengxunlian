import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

@Component({
  selector: 'app-shop-info',
  templateUrl: './shop-info.page.html',
  styleUrls: ['./shop-info.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShopInfoPage implements OnInit {
  userinfo: StaticValue.UserBasicInfo;

  createTime: string;
  constructor(private accountManager: ClientAccountManagerService) {
    accountManager.userinfo().then(info => {
      this.userinfo = info;
      const date = new Date(this.userinfo.createTime);
      this.createTime = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    });
  }

  ngOnInit() {
  }

}
