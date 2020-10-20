import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validators } from '@angular/forms';
import * as utils from '../../utils/utils.module';

@Directive({
  selector: '[ldyPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordDirective,
      multi: true
    }]
})
export class PasswordDirective implements Validators {
  constructor() { }

  vlaidate(control: AbstractControl): ValidationErrors {
    return utils.validation.validPassword(control.value) ? null : {password: true};
  }
}
