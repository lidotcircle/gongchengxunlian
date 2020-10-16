import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/service/local-storage.service';
import { SessionStorageService } from '../../shared/service/session-storage.service';
import { StaticValue } from '../../shared/static-value/static-value.module';

@Component({
    selector: 'app-default',
    templateUrl: './default.page.html',
    styleUrls: ['./default.page.scss'],
})
export class DefaultPage implements OnInit {

    constructor(private localstorage: LocalStorageService,
                private sessionStorage: SessionStorageService,
                private router: Router) { }

    ngOnInit() {
    }

    logout() {
        this.localstorage.remove(StaticValue.LOGIN_TOKEN);
        this.router.navigateByUrl('');
    }
}

