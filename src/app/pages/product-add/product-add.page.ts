import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';
import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddPage implements OnInit {
  productModel: StaticValue.Product = new StaticValue.Product();
  photoURLs = [];

  constructor(private productService: ProductService,
              private categoryService: MockCategoryService) {}

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
}
