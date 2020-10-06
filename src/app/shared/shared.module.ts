import { LocalStorageService } from './service/local-storage.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    NgForm,
    LocalStorageService,
  ],
  exports: [
    NgForm,
    LocalStorageService,
  ]
})
export class SharedModule { }

export function assert(value: any, error?: string) {
  if (!value) {
    throw error ? error : 'bad value';
  }
}
