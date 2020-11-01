import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

@Component({
  selector: 'ldy-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  @Input()
  product: StaticValue.Product;
  @Output()
  share = new EventEmitter<void>();

  constructor() { }

  
  ngOnInit() {
    if(!this.product) {
      throw new Error('bad product view');
    }
  }

  onShare() {
    this.share.emit();
  }
}
