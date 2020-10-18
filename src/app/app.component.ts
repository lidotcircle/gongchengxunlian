import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { StaticValue } from './shared/static-value/static-value.module';
import { ClientAccountManagerService } from './shared/service/client-account-manager.service';
import { LocalStorageService } from './shared/service/local-storage.service';
import { StorageEvent } from './shared/service/Storage';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    public selectedIndex: number = -1;
    public appPages = [
        { title: '开店论坛', url: '/default/chat', icon: 'chatbox' },
        { title: '手机橱窗', url: '/default/exhibit', icon: 'create' },
        { title: '邀请有礼', url: '/default/invite', icon: 'share-social' },
        { title: '资金账户', url: '/default/account', icon: 'cash' },
        { title: '反馈建议', url: '/default/feedback', icon: 'cube' },
        { title: '帮助中心', url: '/default/help', icon: 'help-circle' },
    ];

    public userInfo: {name: string, phone: string} = {
        name: "未登录",
        phone: "00000000000"
    };

    disable_menu: boolean = true;
    private update_menu_state() {
        this.disable_menu = !this.accountManager.userinfo();
    }

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private accountManager: ClientAccountManagerService,
        private localstorage: LocalStorageService,
        private menu: MenuController
    ) {
        this.initializeApp();
        this.update_menu_state();
        this.localstorage.subscribe(StaticValue.LOGIN_TOKEN, StorageEvent.Change, () => this.update_menu_state());

        let updateUserInfo = () => {
            this.userInfo.name = "未登录";
            this.userInfo.phone = "00000000000";

            this.accountManager.userinfo().then(info => {
                if (info != null) {
                    this.userInfo.name = info.shopName;
                    this.userInfo.phone = info.phone;
                }
            });
        };

        this.accountManager.subscribeAccountChange(updateUserInfo);
        updateUserInfo();
        this.router.events.subscribe(e => {
            if(e instanceof NavigationEnd) {
                for(let idx=0;idx<this.appPages.length;idx++) {
                    if (this.appPages[idx].url == e.url) {
                        this.selectedIndex = idx;
                    }
                }

                updateUserInfo();
            }
        });
    }

    goto(url: string) {
        this.menu.close().then(() => {
            this.router.navigateByUrl(url);
        })
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }
}
