import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import { Plugins, CameraResultType } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
const { Camera } = Plugins;
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddPage implements OnInit {
  productModel: StaticValue.Product = new StaticValue.Product();
  photoURLs = [];

  private subscription;
  constructor(private productService: ProductService,
              private categoryService: MockCategoryService,
              private router: Router,
              private modal: ModalController,
              private barcodeScanner: BarcodeScanner) {
                this.subscription = this.categoryService.watchSelectCategory().subscribe(obs => {
                  this.productModel.categoryId = obs.id;
                });
                this.categoryService.selectCategoryId.next({id: 0, name: ''});
              }

  ngOnInit() {
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
    console.log('scan');
    this.barcodeScanner.scan().then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  onSelectCategory() {
    this.router.navigate(['/category-list'], {queryParams: {select: true}})
  }

  getCategoryName(): string {
    return this.categoryService.getCategoryNameById(this.productModel.categoryId);
  }

  check(): boolean {
    return this.productModel.photos.length == 0 || this.productModel.barCode.length == 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
