import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validators } from '@angular/forms';
import * as utils from '../../utils/utils.module';

@Directive({
  selector: '[ldyEmail]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailDirective,
      multi: true
    }]
})
export class EmailDirective implements Validators {
  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    return (!control.value || control.value.length ==0 || utils.validation.validEmail(control.value)) ? null : {email: true};
  }
}
