import { ApplicationRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import { Plugins, CameraResultType } from '@capacitor/core';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
const { Camera } = Plugins;
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { makeid } from 'src/app/shared/utils/utils.module';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddPage implements OnInit, ViewWillEnter {
  productModel: StaticValue.Product = new StaticValue.Product();
  photoURLs = [];
  categoryName: string = '';

  private my_name: string = makeid(20);;
  private subscription;
  constructor(private productService: ProductService,
              private categoryService: MockCategoryService,
              private router: Router,
              private location: Location,
              private alert: AlertController,
              private toast: ToastController,
              private statusBar: StatusBar,
              private appRef: ApplicationRef,
              private barcodeScanner: BarcodeScanner) {
    this.subscription = this.categoryService.watchSelectCategory().subscribe(obs => {
      if (obs.requestor == this.my_name) {
        this.productModel.categoryId = obs.id;
        this.categoryName = obs.name;
      }
    });
    this.productModel.categoryId = 0;
    this.categoryName = '默认分类';
  }

  /**
   * 更新 Angular 视图,解决在 Android 下的返回刷新 Bug
   *
   * @memberof ProductAddPage
   */
  ionViewWillEnter(): void {
    console.log('flush view ');
    this.appRef.tick();
  }

  /**
   * 开启沉浸式状态
   *
   * @memberof ProductAddPage
   */
  ngOnInit() {
    this.statusBar.overlaysWebView(true);
  }

  /**
   * 添加商品图片
   *
   * @memberof ProductAddPage
   */
  async onAddPhotoClick() {
    const photo = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.Base64
    });
    let img_src = 'data:image/' + photo.format + ';base64,';
    img_src += photo.base64String;
    this.photoURLs.push(img_src);
    this.productModel.photos.push(photo.base64String);
  }

  /**
   * 删除已经添加的商品图片
   *
   * @param {number} n
   * @memberof ProductAddPage
   */
  onCancelAddPhoto(n: number) {
    if(n >= this.photoURLs.length) {
      throw new Error('runtime error');
    }

    this.photoURLs.splice(n, 1);
    this.productModel.photos.splice(n, 1);
  }

  /**
   * 扫描条形码
   *
   * @memberof ProductAddPage
   */
  onScanBarCode() {
    this.barcodeScanner.scan({prompt: '将条形码置于扫描区域'}).then(result => {
      this.productModel.barCode = result.text
    }).catch(err => {
      console.log(err);
    });
  }

  /**
   * 无用，用弹出窗口编辑条形码
   *
   * @memberof ProductAddPage
   */
  async onEditBarCode() {
    const alert = await this.alert.create({
      header: '编辑条形码',
      inputs: [
        {
          name: 'barcode',
          type: 'text',
          placeholder: '输入条形码',
          value: this.productModel.barCode
        }
      ],
      buttons: [
        {
          text: '确认',
          handler: (data) => {
            this.productModel.barCode = data["barcode"];
          }
        },
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }

  /**
   * 跳转到商品分类选择, 利用 RxJs 进行分类选择的同步
   *
   * @memberof ProductAddPage
   */
  onSelectCategory() {
    this.router.navigate(['/category-list'], {queryParams: {select: true, requestor: this.my_name}})
  }

  inAdd: boolean = false;
  /**
   * 添加商品，并且刷新界面, Input 的 touched 在 HTML 直接调用 API 消除
   *
   * @return {*}  {Promise<boolean>}
   * @memberof ProductAddPage
   */
  async addProductAndContinue(): Promise<boolean> {
    if(this.inAdd) return false;
    this.inAdd = true;
    let ans = false;
    try {
      ans = await this.productService.addProducts(this.productModel);
      if (ans) {
        const cid = this.productModel.categoryId;
        this.productModel = new StaticValue.Product();
        this.productModel.categoryId = cid;
        this.photoURLs = [];
        (await this.toast.create({
          message: '添加商品成功',
          duration: 2000
        })).present();
      } else {
        (await this.toast.create({
          message: '添加商品失败',
          duration: 2000
        }
        )).present();
      }
    } catch (err) {
      (await this.toast.create({
        message: "添加商品异常，可能是照片过大。Require additional " + JSON.stringify(this.productModel).length + 'bytes',
        duration: 2000
      })).present();
    } finally {
      this.inAdd = false;
    }
    return ans;
  }

  async addProductAndGoBack() {
    const ans = await this.addProductAndContinue();
    if(ans) {
      this.location.back();
    }
  }

  /**
   * 取消 商品分类的 RxJS 订阅
   *
   * @memberof ProductAddPage
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
