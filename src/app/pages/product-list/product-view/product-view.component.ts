import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

@Component({
  selector: 'ldy-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  @Input()
  product: StaticValue.Product;
  @Output('share')
  share = new EventEmitter<void>();

  constructor(private router: Router) { 
  }

  
  ngOnInit() {
    if(!this.product) {
      throw new Error('bad product view');
    }
  }

  onShare() {
    this.share.emit();
  }

  onClickGotoDetail() {
    this.router.navigate(['/product-detail'], {queryParams: {productId: this.product.productId}});
  }
}
