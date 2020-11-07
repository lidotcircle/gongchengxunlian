import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validators } from '@angular/forms';

const barcodeRegex = new RegExp('[0-9]{13}');

@Directive({
  selector: '[ldyBarcode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: BarcodeDirective,
      multi: true
    }]
})
export class BarcodeDirective implements Validators {
  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    return (!control.value || control.value.length == 0 || control.value.match(barcodeRegex)) ? null : {barcode: true};
  }
}
