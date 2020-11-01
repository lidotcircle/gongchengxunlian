import { Injectable } from '@angular/core';
import { StaticValue } from '../static-value/static-value.module';
import { ClientAccountManagerService, HookType } from './client-account-manager.service';
import { MockCategoryService } from './mock-category.service';

export type ProductListResult = [number, StaticValue.Product[]];
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

  async getListByFilter(index: number, size: number, filter: {(p: StaticValue.Product): boolean}): Promise<ProductListResult> {
    let ans = [];
    if(index < 0) {
      throw new Error('bad index');
    }
    if(size <= 0) {
      throw new Error('bad page size');
    }
    let vv = this.products.filter(filter);
    const u = index * size;
    if(u < vv.length) {
      ans = vv.slice(u, u + size);
    }
    return [vv.length, ans];
  }

  /**
   * 按添加顺序获取产品
   *
   * @param {number} index 
   * @param {number} size
   * @return {*}  {Promise<ProductListResult>}
   * @memberof ProductService
   */
  async getList(index: number, size: number): Promise<ProductListResult> {
    return await this.getListByFilter(index, size, () => true);
  }

  async getListByCategoryId(index: number, size: number, categoryId: number): Promise<ProductListResult> {
    return await this.getListByFilter(index, size, (p) => p.categoryId == categoryId);
  }

  async getListByCondition(index: number, size: number, condition: string): Promise<ProductListResult> {
    return await this.getListByFilter(index, size, (p) => p.categoryId == 0);
  }
}
