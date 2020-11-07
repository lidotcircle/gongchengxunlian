import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validators } from '@angular/forms';

@Directive({
  selector: '[ldyMaxLength]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxLengthDirective,
      multi: true
    }]
})
export class MaxLengthDirective implements Validators, OnInit {
  @Input('ldyMaxLength') private maxLength: number;
  constructor() {}

  ngOnInit() {
    this.maxLength = this.maxLength || 0;
  }

  validate(control: AbstractControl): ValidationErrors {
    return (!control.value || control.value.length <= this.maxLength) ? null : {maxLength: true};
  }
}
