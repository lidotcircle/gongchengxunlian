import { Injectable } from '@angular/core';
import { StaticValue } from '../static-value/static-value.module';
import { ClientAccountManagerService, HookType } from './client-account-manager.service';
import { MockCategoryService } from './mock-category.service';
import * as rxjs from 'rxjs';
import * as pinyin from 'pinyin';

export class ProductListResult {
  total: number = 0;
  totalRemain: number = 0;
  totalInPrice: number = 0;
  products: StaticValue.Product[] = [];
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: StaticValue.Product[];

  private _change: rxjs.Subject<boolean> = new rxjs.Subject<boolean>();
  get change() {return this._change;}

  constructor(private accountManager: ClientAccountManagerService,
              private categoryManager: MockCategoryService) {
    const update = () => {
      this.accountManager.getProducts().then(products => {
        this.products = products || []
        this.change.next(true);
      });
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
    this.products.push(JSON.parse(JSON.stringify(product)));
    let ans = false;
    try {
      ans = await this.accountManager.setProducts(this.products);
    } finally {
      if(!ans) {
        this.products.pop();
      }
    }
    if(ans) {
      this._change.next(true);
    }
    return ans;
  }

  async removeProducts(productId: number): Promise<boolean> {
    let ans = false;
    for(let i=0;i<this.products.length;i++) {
      if(this.products[i].productId == productId) {
        const deletep = this.products.splice(i, 1);
        try {
          ans = await this.accountManager.setProducts(this.products);
          setTimeout(() => this._change.next(true));
        } catch {
          this.products.push(deletep[0]);
          ans = false;
        }
        break;
      }
    }
    return ans;
  }

  private async getListByFilter(index: number, size: number, filter: {(p: StaticValue.Product): boolean}): Promise<ProductListResult> {
    let ans = [];
    if(index < 0) {
      throw new Error('bad index');
    }
    if(size <= 0) {
      throw new Error('bad page size');
    }
    let vv = this.products.filter(filter);
    let total_price = 0;
    let total_remain = 0;
    for(let p of vv) {
      total_price += p.originalPrice * p.remainCount;
      total_remain += p.remainCount;
    }
    const u = index * size;
    if(u < vv.length) {
      ans = vv.slice(u, u + size);
    }
    return {
      total: vv.length,
      totalRemain: total_remain,
      totalInPrice: total_price,
      products: ans
    };
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

  /**
   * 根据产品的类别来获取产品 TODO subcategory ...
   *
   * @param {number} index
   * @param {number} size
   * @param {number} categoryId
   * @return {*}  {Promise<ProductListResult>}
   * @memberof ProductService
   */
  async getListByCategoryId(index: number, size: number, categoryId: number): Promise<ProductListResult> {
    const ids = await this.categoryManager.getIds(categoryId);
    return await this.getListByFilter(index, size, (p) => ids.indexOf(p.categoryId) >= 0);
  }

  /**
   * 获得在产品名称、产品名称拼音、条形码中搜索 字符串
   *
   * @param {number} index
   * @param {number} size
   * @param {string} condition 用于匹配的字符串
   * @return {*}  {Promise<ProductListResult>}
   * @memberof ProductService
   */
  async getListByCondition(index: number, size: number, condition: string): Promise<ProductListResult> {
    return await this.getListByFilter(index, size, (p) => {
      const regex = new RegExp(condition);
      const pin = (pinyin(p.productName) || []).join();
      if(p.productName.match(regex) || 
         pin.match(regex) || 
         p.barCode.toString().match(regex)) {
        return true;
      } else {
        return false;
      }
    });
  }

  async getProductByProductId(id: number): Promise<StaticValue.Product> {
    let ans = null;
    for(const p of this.products || []) {
      if(p.productId == id) {
        ans = JSON.parse(JSON.stringify(p));
        break;
      }
    }
    return ans;
  }

  async InStock(productId: number, count: number, remark: string): Promise<boolean> {
    let record = new StaticValue.InOutRecord();
    let ans = false;
    if(!count || count <= 0) {
      return ans;
    }
    for(let p of this.products) {
      if(p.productId == productId) {
        record.current = p.remainCount;
        record.in = count;
        record.remarks = remark;
        p.remainCount += count;
        ans = await this.accountManager.setProducts(this.products);
        break;
      }
    }
    if(ans) {
      this.accountManager.newInOutRecord(productId, record);
    }
    return ans;
  }

  async OutStock(productId: number, count: number, remark: string): Promise<boolean> {
    let record = new StaticValue.InOutRecord();
    let ans = false;
    if(!count || count <= 0) {
      return ans;
    }
    for(let p of this.products) {
      if(p.productId == productId) {
        record.current = p.remainCount;
        record.out = count;
        record.remarks = remark;
        if(p.remainCount >= count) {
          p.remainCount -= count;
          ans = await this.accountManager.setProducts(this.products);
        }
        break;
      }
    }
    if(ans) {
      this.accountManager.newInOutRecord(productId, record);
    }
    return ans;
  }

  async getRecords(productId: number): Promise<StaticValue.InOutRecord[]> {
    return this.accountManager.getRecords(productId);
  }

  async empty(): Promise<boolean> {
    const products = await this.accountManager.getProducts();
    return !products || products.length == 0;
  }
}
