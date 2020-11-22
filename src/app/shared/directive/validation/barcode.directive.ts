import { Directive, HostListener, Optional } from '@angular/core';
import { AbstractControl, NgModel, NG_VALIDATORS, ValidationErrors, Validators } from '@angular/forms';

const barcodeRegex = new RegExp('^[0-9]{12,14}$');
const permitInput = new RegExp('^[0-9]{0,13}$');

@Directive({
  selector: '[ldyBarcode]',
  // providers: [{provide: NG_VALIDATORS, useExisting: BarcodeDirective, multi: true}]
})
export class BarcodeDirective implements Validators {
  private prev: string = '';
  constructor(@Optional() private ngModel: NgModel) { }

  validate(control: AbstractControl): ValidationErrors {
    return (control.value && !control.value.match(barcodeRegex)) ? {barcode: true} : null;
  }

  @HostListener('input', ['$event']) onInput(event) {
    if(!event.target.value.match(permitInput)) {
      event.target.value = this.prev;
      this.ngModel.control.patchValue(event.target.value);
    }
    this.prev = event.target.value;
  }
}
