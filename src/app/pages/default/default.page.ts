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

