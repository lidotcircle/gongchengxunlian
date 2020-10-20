import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordDirective } from './directive/validation/password.directive';
import { EmailDirective } from './directive/validation/email.directive';
import { NameDirective } from './directive/validation/name.directive';
import { PhoneDirective } from './directive/validation/phone.directive';


@NgModule({
    declarations: [PasswordDirective, EmailDirective, NameDirective, PhoneDirective],
    imports: [
        CommonModule
    ],
    exports: [
        PasswordDirective,
        EmailDirective,
        NameDirective,
        PhoneDirective
    ],
    providers: [
    ]
})
export class SharedModule { }

export function assert(value: any, error?: string) {
    if (!value) {
        throw error ? error : 'bad value';
    }
}
