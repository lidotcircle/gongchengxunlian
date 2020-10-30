import { Injectable } from '@angular/core';
import { StaticValue } from '../static-value/static-value.module';
import { ClientAccountManagerService, HookType } from './client-account-manager.service';
import { MockCategoryService } from './mock-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: StaticValue.Product[];

  constructor(private accountManager: ClientAccountManagerService,
              private categoryManager: MockCategoryService) {
    const update = () => {
      this.accountManager.getProducts().then(products => this.products = products || []);
    }
    update();
    this.accountManager.subscribe(HookType.UserInfoChange, update);
  }

  private autoIncrementId(): number {
    let id = 0;
    for(let p of this.products) {
      if(p.productId >= id) id = p.productId + 1;
    }
    return id;
  }

  async addProducts(product: StaticValue.Product): Promise<boolean> {
    product.productId = this.autoIncrementId();
    this.products.push(product);
    return await this.accountManager.setProducts(this.products);
  }
}
