import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ToastController } from '@ionic/angular';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { ProductService, ProductListResult } from 'src/app/shared/service/product.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import { makeid } from 'src/app/shared/utils/utils.module';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListPage implements OnInit {
  empty: boolean = true;
  queryTerm: string = '';
  remainCount: number = 0;
  totalInPrice: number = 0;
  selectecCategoryId: number = -1;
  pageIndex: number = 0;
  productsTotal: number = 0;
  pageSize: number = 4;
  products: StaticValue.Product[] = [];

  @ViewChild(IonInfiniteScroll)
  infiniteScroll: IonInfiniteScroll;

  private my_name = makeid(20);
  constructor(private router: Router,
              private categoryService: MockCategoryService,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private productService: ProductService) {
    this.categoryService.selectCategoryId.subscribe(sel => {
      if (sel.requestor != this.my_name) return;
      this.selectecCategoryId = sel.id;
      this.pageIndex = 0;
      this.queryTerm = '';
      this.loading();
   });

    this.productService.empty().then(empty => {
      this.empty = empty
    });
  }

  async ngOnInit() {
    await this.loading();
  }

  private async refresh(force: boolean): Promise<boolean> {
    let prom: Promise<ProductListResult>;
    if (this.queryTerm && this.queryTerm.length > 0) {
      prom = this.productService.getListByCondition(this.pageIndex, this.pageSize, this.queryTerm);
    } else if (this.selectecCategoryId >= 0) {
      prom = this.productService.getListByCategoryId(this.pageIndex, this.pageSize, this.selectecCategoryId);
    } else {
      prom = this.productService.getList(this.pageIndex, this.pageSize);
    }

    return prom.then(p => {
      if(this.remainCount == p.total && p.products.length == 0 && !force) {
        return false;
      }
      this.remainCount = p.total;
      this.products = JSON.parse(JSON.stringify(p.products));
      this.totalInPrice = p.totalPrice;
      return true;
    });
  }

  private async loading(): Promise<void> {
    const loading = await this.loadingController.create({
      message: '正在加载数据，请稍后...',
      spinner: 'bubbles'
    });
    await loading.present();

    return new Promise((resolve, _) => {
      setTimeout(() => {
        this.refresh(true).
        catch(() => { }).
        finally(() => loading.dismiss().then(() => resolve()));
      }, 500);
    });
  }

  onGotoSelectCategory() {
    if(this.empty) return;
    this.router.navigate(['/category-list'], {queryParams: {select: true, requestor: this.my_name}});
  }

  onGotoAddingProduct() {
    this.router.navigate(['/product-add']);
  }

  async onQueryText() {
    this.pageIndex = 0;
    this.selectecCategoryId = -1;
    await this.loading();
  }

  async onRefresh(event) {
    this.pageIndex = 0;
    setTimeout(() => {
      this.refresh(true).finally(() => event.target.complete());
    }, 1000);
  }

  async onInfinite(event) {
    this.pageIndex++;
    setTimeout(() => {
      this.refresh(false)
      .then(refreshed => {
        if (!refreshed) {
          this.toastController.create({
            message: '已经是最后一页',
            duration: 2000
          }).then(t => t.present());
        }
      })
      .finally(() => {
        event.target.complete();
      });
    }, 1000);
  }
}
