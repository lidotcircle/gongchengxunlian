import { ApplicationRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import { Plugins, CameraResultType } from '@capacitor/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
const { Camera } = Plugins;
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddPage implements OnInit {
  productModel: StaticValue.Product = new StaticValue.Product();
  photoURLs = [];
  categoryName: string = '';

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
      this.productModel.categoryId = obs.id;
      this.categoryName = obs.name;
      this.appRef.tick();
    });
    this.categoryService.selectCategoryId.next({id: 0, name: '默认分类'});
  }

  ngOnInit() {
    this.statusBar.overlaysWebView(true);
  }

  async onAddPhotoClick(){
    const photo = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.Base64
    });
    let img_src = 'data:image/' + photo.format + ';base64,';
    img_src += photo.base64String;
    this.photoURLs.push(img_src);
    this.productModel.photos.push(photo.base64String);
  }

  onCancelAddPhoto(n: number) {
    if(n >= this.photoURLs.length) {
      throw new Error('runtime error');
    }

    this.photoURLs.splice(n, 1);
    this.productModel.photos.splice(n, 1);
  }

  onScanBarCode() {
    this.barcodeScanner.scan({prompt: '将条形码置于扫描区域'}).then(result => {
      this.productModel.barCode = result.text
    }).catch(err => {
      console.log(err);
    });
  }

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

  onSelectCategory() {
    this.router.navigate(['/category-list'], {queryParams: {select: true}})
  }

  inAdd: boolean = false;
  async addProductAndContinue(): Promise<boolean> {
    if(this.inAdd) return false;
    this.inAdd = true;
    let ans = false;
    try {
      ans = await this.productService.addProducts(this.productModel);
      if (ans) {
        this.productModel = new StaticValue.Product();
        this.photoURLs = [];
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
