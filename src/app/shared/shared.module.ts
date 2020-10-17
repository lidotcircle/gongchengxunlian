import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
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
