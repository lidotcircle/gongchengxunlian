import { ApplicationRef, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-product-in-out-of-stock',
  templateUrl: './product-in-out-of-stock.page.html',
  styleUrls: ['./product-in-out-of-stock.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductInOutOfStockPage implements OnInit {
  inInput: number;
  inRemark: string = '';
  outInput: number;
  outRemark: string = '';
  inIn: boolean = true;

  private productId: number;
  inStockCount: number;

  @ViewChild('panel')
  private panel: ElementRef;

  constructor(private productService: ProductService,
              private activatedRouter: ActivatedRoute,
              private router: Router,
              private toast: ToastController,
              private appRef: ApplicationRef) { }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(param => {
      this.productId    = param['productId'];
      this.inStockCount = this.inStockCount || parseInt(param['productStockCount'] || 0);
    });
  }

  onClickInStockButton() {
    if(this.inIn) return;
    this.inIn = true;
    const panele = this.panel.nativeElement as HTMLElement;
    panele.classList.remove('outAnim');
    panele.classList.add   ('inAnim');
  }

  onClickOutStockButton() {
    if(!this.inIn) return;
    this.inIn = false;
    const panele = this.panel.nativeElement as HTMLElement;
    panele.classList.remove('inAnim');
    panele.classList.add   ('outAnim');
  }

  onCheckRecords() {
    this.router.navigate(['product-in-out-records'], {
      queryParams: {
        productId: this.productId
      }
    });
  }

  async confirmIn()  {
    const ans = await this.productService.InStock(this.productId, this.inInput, this.inRemark);
    let msg = ans ? '入库成功' : '入库失败';
    await (await this.toast.create({
      message: msg,
      duration: 2000
    })).present();
    if(ans) {
      this.inRemark = '';
      this.inStockCount += this.inInput;
      this.inInput = 0;
      this.appRef.tick();
    }
  }
  async confirmOut() {
    const ans = await this.productService.OutStock(this.productId, this.outInput, this.outRemark);
    let msg = ans ? '出库成功' : '出库失败';
    await (await this.toast.create({
      message: msg,
      duration: 2000
    })).present();
    if(ans) {
      this.outRemark = '';
      this.inStockCount -= this.outInput;
      this.outInput = 0;
      this.appRef.tick();
    }
  }
}
