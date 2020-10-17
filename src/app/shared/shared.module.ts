import { LocalStorageService } from './service/local-storage.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CopyrightComponent } from '../components/copyright/copyright.component';



@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    exports: [
    ]
})
export class SharedModule { }

export function assert(value: any, error?: string) {
    if (!value) {
        throw error ? error : 'bad value';
    }
}
