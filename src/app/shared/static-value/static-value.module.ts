/** constants string and symbol */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class StaticValue {
  static APP_KEY   = 'APP';
  static IS_LANUCHED = 'IS_LANUCHED';
  static APP_VERSION = '1.0.0';
}
