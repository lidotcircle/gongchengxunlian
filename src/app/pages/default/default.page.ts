import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
import { ISaleData, SaleService } from 'src/app/shared/service/sale.service';
import { LocalStorageService } from '../../shared/service/local-storage.service';
import { SessionStorageService } from '../../shared/service/session-storage.service';
import { StaticValue } from '../../shared/static-value/static-value.module';

@Component({
    selector: 'app-default',
    templateUrl: './default.page.html',
    styleUrls: ['./default.page.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultPage implements OnInit {
    saleData: ISaleData;
    tools: Array<{title: string, url: string, img: string}> = [
        {title: '新增商品', url: '/product-add',    img: '../../../assets/img/default/add_salse.png'},
        {title: '新增会员', url: '/default/add-user', img: '../../../assets/img/default/add_user.png'},
        {title: '收银记账', url: '/default/account' , img: '../../../assets/img/default/sales_account.png'},
        {title: '支出管理', url: '/default/add-mech', img: '../../../assets/img/default/a_note.png'},
        {title: '商品管理', url: '/product-list', img: '../../../assets/img/default/sales_management.png'},
        {title: '会员管理', url: '/default/add-mech', img: '../../../assets/img/default/user_management.png'},
        {title: '查询销售', url: '/default/add-mech', img: '../../../assets/img/default/shop_management.png'},
        {title: '智能分析', url: '/default/add-mech', img: '../../../assets/img/default/analysis.png'},
        {title: '供应商管理', url: '/default/add-mech', img: '../../../assets/img/default/gongying_more.png'},
        {title: '挂单', url: '/default/add-mech', img: '../../../assets/img/default/guandan_more.png'},
        {title: '高级功能', url: '/default/add-mech', img: '../../../assets/img/default/image_addsales.png'},
    ];

    constructor(private localstorage: LocalStorageService,
                private sessionStorage: SessionStorageService,
                private router: Router,
                private accountManager: ClientAccountManagerService,
                private saleStat: SaleService) {
                    this.saleData = this.saleStat.getSaleData();
                }

    ngOnInit() {
    }

    logout() {
        this.accountManager.logout();
    }
}

