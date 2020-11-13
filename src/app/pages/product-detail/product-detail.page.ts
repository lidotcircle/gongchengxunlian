import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClientAccountManagerService } from 'src/app/shared/service/client-account-manager.service';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import { ShareInBottomComponent } from 'src/app/components/share-in-bottom/share-in-bottom.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDetailPage implements OnInit, OnDestroy {
  photoURLs: string[] = [];
  product: StaticValue.Product = new StaticValue.Product();
  categoryName: string = '';
  showDropDownMenu: boolean = false;
  showOriginalPrice: boolean = false;
  shareMessage: string = '';

  @ViewChild(ShareInBottomComponent, {static: true})
  private share: ShareInBottomComponent;

  private productId: number = null;
  private subscriptionOfProductService: Subscription;
  constructor(private activatedRouter: ActivatedRoute,
              private router: Router,
              private location: Location,
              private toast: ToastController,
              private alert: AlertController,
              private accountManager: ClientAccountManagerService,
              private categoryService: MockCategoryService,
              private productService: ProductService) {
  }

  ngOnInit() {
    const update = () => {
      this.productService.getProductByProductId(this.productId).then(product => {
        this.product = product || this.product;
        this.photoURLs = [];
        this.product.photos.map(photo => this.photoURLs.push('data:image/jpeg;base64,' + photo));
        this.categoryName = this.categoryService.getCategoryNameById(this.product.categoryId);
      });
    }
    this.activatedRouter.queryParams.subscribe(param => {
      this.productId = param["productId"];
      update();
    });
    this.subscriptionOfProductService = this.productService.change.subscribe(_ => update());
  }

  ngOnDestroy(): void {
    this.subscriptionOfProductService.unsubscribe();
  }

  onCancelAddPhoto(n: number) {
  }
  onClickAddPhoto() {
  }

  onClickDropDownMenu() {
    const show = !this.showDropDownMenu;
    setTimeout(() => this.showDropDownMenu = show, 0);
  }

  onClickInOutOfStock() {
    this.router.navigate(['/product-in-out-of-stock'], {
      queryParams: {
        productId: this.productId, 
        productStockCount: this.product.remainCount
      }
    });
  }

  onClickShare() {
    this.share.show();
  }

  onClickModify() {
  }

  async onClickDelete() {
    await (await this.alert.create({
      message: '删除商品？ 删除将不可恢复',
      buttons: [
        {
          text: '确认',
          handler: () => {
            this.productService.removeProducts(this.productId)
            .then(success => {
              if(success) {
                this.toast.create({
                  message: '删除成功',
                  duration: 2000
                }).then(p => p.present());
                this.location.back();
              } else {
                this.toast.create({
                  message: '删除失败',
                  duration: 2000
                }).then(p => p.present());
              }
            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    })).present();
  }

  async onClickShowOriPrice() {
    (await this.alert.create({
      message: '请输入账户密码查看商品进价',
      inputs: [
        {
          name: 'username',
          placeholder: '用户名/手机号/邮箱',
          type: "text"
        },
        {
          name: 'password',
          type: 'password',
          placeholder: '密码',
        }
      ],
      buttons: [
        {
          handler: data => {
            this.accountManager.verifyUser(data["username"], data["password"]).then(success => {
              if(success) {
                this.showOriginalPrice = true;
              } else {
                this.toast.create({
                  message: '用户名或者密码错误',
                  duration: 2000
                }).then(t => t.present());
              }
            });
          },
          text: "确认",
        },
        {
          handler: () => {},
          text: '取消',
          role: 'cancel'
        }
      ]
    })).present();
  }

  onTouchAnything() {
    this.showDropDownMenu = false;
  }
}
