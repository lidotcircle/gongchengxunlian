import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordDirective } from './directive/validation/password.directive';
import { EmailDirective } from './directive/validation/email.directive';
import { NameDirective } from './directive/validation/name.directive';
import { PhoneDirective } from './directive/validation/phone.directive';
import { BarcodeDirective } from './directive/validation/barcode.directive';
import { MaxLengthDirective } from './directive/validation/max-length.directive';
import { PositiveNumberDirective } from './directive/format/positive-number.directive';
import { NonNegativeNumberDirective } from './directive/format/non-negative-number.directive';


@NgModule({
    declarations: [
        PasswordDirective, EmailDirective, 
        NameDirective, PhoneDirective,
        BarcodeDirective, MaxLengthDirective,
        PositiveNumberDirective, NonNegativeNumberDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        PasswordDirective,
        EmailDirective,
        NameDirective,
        PhoneDirective,
        BarcodeDirective,
        MaxLengthDirective,
        PositiveNumberDirective,
        NonNegativeNumberDirective
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
