import { LocalStorageService } from './service/local-storage.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from './service/session-storage.service';
import { AccountManageService } from './service/account-manage.service';
import { AuthenticationCodeService } from './service/authentication-code.service';



@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
    ],
    providers: [
        LocalStorageService,
        SessionStorageService,
        AccountManageService,
        AuthenticationCodeService
    ]
})
export class SharedModule { }

export function assert(value: any, error?: string) {
    if (!value) {
        throw error ? error : 'bad value';
    }
}
