import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validators } from '@angular/forms';
import * as utils from '../../utils/utils.module';

@Directive({
  selector: '[ldyPhone]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PhoneDirective,
      multi: true
    }]
})
export class PhoneDirective implements Validators {
  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    return utils.validation.validPhone(control.value) ? null : {phone: true};
  }
}
