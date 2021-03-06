import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ToastController, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ShareInBottomComponent } from 'src/app/components/share-in-bottom/share-in-bottom.component';
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
export class ProductListPage implements OnInit, OnDestroy, ViewWillEnter {
  empty: boolean = true;
  queryTerm: string = '';
  remainCount: number = 0;
  totalRemain: number = 0;
  totalInPrice: number = 0;
  selectecCategoryId: number = -1;
  pageIndex: number = 0;
  productsTotal: number = 0;
  pageSize: number = 4;
  products: StaticValue.Product[] = [];
  shareMessage: string = '';

  @ViewChild(IonInfiniteScroll)
  infiniteScroll: IonInfiniteScroll;

  @ViewChild(ShareInBottomComponent, {static: true})
  private shareElem: ShareInBottomComponent;

  @ViewChild('productListPage', {static: true})
  private page: ElementRef;

  private my_name = makeid(20);
  constructor(private router: Router,
              private categoryService: MockCategoryService,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private productService: ProductService) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    this.pageSize = Math.floor((vh - 200) / 110);
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

  private changed = true;
  ionViewWillEnter() {
    if (this.changed) {
      this.loading().finally(() => this.changed = false);
    }
  }

  private subscriptionOfProductChange: Subscription;
  async ngOnInit() {
   this.subscriptionOfProductChange = this.productService.change.subscribe(_ => {
     this.changed = true;
   });
  }

  ngOnDestroy(): void {
    this.subscriptionOfProductChange.unsubscribe();
  }

  /**
   * ????????????????????????
   *
   * @private
   * @param {boolean} force ???????????????????????????????????????
   * @return {*}  {Promise<boolean>}
   * @memberof ProductListPage
   */
  private async refresh(force: boolean, append: boolean = false): Promise<boolean> {
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
      this.totalRemain = p.totalRemain;
      if (append) {
        for(let m of JSON.parse(JSON.stringify(p.products))) this.products.push(m);
      } else {
        this.products = JSON.parse(JSON.stringify(p.products));
      }
      this.totalInPrice = p.totalInPrice;
      return true;
    });
  }

  private inLoading: boolean = false;
  /**
   * ????????????????????????, 0.5s ??????
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof ProductListPage
   */
  private async loading(): Promise<void> {
    if(this.inLoading) {
      return;
    }
    this.inLoading = true;
    const loading = await this.loadingController.create({
      message: '??????????????????????????????...',
      spinner: 'bubbles'
    });
    await loading.present();

    return new Promise((resolve, _) => {
      setTimeout(() => {
        this.refresh(true).
        catch(() => { }).
        finally(() => {
          loading.dismiss().then(() => resolve())
          this.inLoading = false;
        });
      }, 500);
    });
  }

  /**
   * ??????????????????????????????
   *
   * @return {*} 
   * @memberof ProductListPage
   */
  onGotoSelectCategory() {
    if(this.empty) return;
    this.router.navigate(['/category-list'], {queryParams: {select: true, requestor: this.my_name}});
  }

  /**
   * ?????????????????????
   *
   * @memberof ProductListPage
   */
  onGotoAddingProduct() {
    this.router.navigate(['/product-add']);
  }

  /**
   * ????????????????????????????????????????????????????????????
   *
   * @memberof ProductListPage
   */
  async onQueryText() {
    this.pageIndex = 0;
    this.selectecCategoryId = -1;
    await this.loading();
  }

  /**
   * ???????????? Callback
   *
   * @param {*} event
   * @memberof ProductListPage
   */
  async onRefresh(event) {
    this.pageIndex = 0;
    setTimeout(() => {
      this.refresh(true).finally(() => event.target.complete());
    }, 1000);
  }

  /**
   * ???????????? Callback
   *
   * @param {*} event
   * @memberof ProductListPage
   */
  async onInfinite(event) {
    this.pageIndex++;
    setTimeout(() => {
      this.refresh(false, false)
      .then(refreshed => {
        if (!refreshed) {
          this.toastController.create({
            message: '?????????????????????',
            duration: 2000
          }).then(t => t.present());
        }
      })
      .finally(() => {
        event.target.complete();
      });
    }, 1000);
  }

  onShare(n: number) {
    // TODO
    this.shareElem.show();
  }
}
