import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[ldyNonNegativeNumber]'
})
export class NonNegativeNumberDirective implements OnInit {
  @Input('type') private type: string;
  private prev: number = null;
  constructor() {
  }

  ngOnInit(): void {
    if(this.type != 'number') {
      throw new Error('unexpected usage of NonNegativeNumber')
    }
  }

  @HostListener('input', ['$event']) onInput(event) {
    if(event?.target?.value) {
      if(event.target.value < 0) {
        event.target.value = -event.target.value;
      }
    } else if (event?.target) {
      if(event.data && (event.data == '-' || event.data == '+')) {
        event.target.value = null;
      }

      if (this.prev && this.prev.toString().length >= 2) {
        event.target.value = this.prev;
      }
    }
    this.prev = event?.target?.value;
  }
}
