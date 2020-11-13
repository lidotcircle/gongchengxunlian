import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

@Component({
  selector: 'app-product-in-out-records',
  templateUrl: './product-in-out-records.page.html',
  styleUrls: ['./product-in-out-records.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductInOutRecordsPage implements OnInit {
  private productId: number;
  records: StaticValue.InOutRecord[] = [];
  constructor(private activateRouter: ActivatedRoute,
              private productService: ProductService) { }

  ngOnInit() {
    const update = () => {
      this.productService.getRecords(this.productId).then(r => {
        this.records = r
      });
    }
    this.activateRouter.queryParams.subscribe(param => {
      this.productId = param['productId'];
      update();
    })
  }
}
