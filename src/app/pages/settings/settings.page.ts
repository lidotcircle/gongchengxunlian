import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsPage implements OnInit {
  items1: Array<{title: string, url: string}> = [
    {title: "店铺设置", url: "shop-info"},
    {title: "密码", url: "change-password"}
  ];

  version: string;
  kefudianhua: string = "400-600-4845";
  constructor(private accountManager: ClientAccountManagerService,
              private toast: ToastController,
              private location: Location) {
    this.version = StaticValue.APP_VERSION;
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
  }

  logout() {
    this.accountManager.logout();
  }

  dial() {
  }

  inUpdate: boolean = false;
  checkUpdate() {
    if (this.inUpdate) return;
    this.inUpdate = true;

    this.toast.create({
      "message": "已经是最新版本",
      "duration": 2000
    }).then(t => {
      t.present().then(() => this.inUpdate = false)
    });
  }
}
