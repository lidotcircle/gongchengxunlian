import { Injectable } from '@angular/core';
import { StaticValue } from '../static-value/static-value.module';
import { ClientAccountManagerService } from './client-account-manager.service';
import { MockCategoryService } from './mock-category.service';

const default_products: StaticValue.UserProducts = [];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: StaticValue.UserProducts;

  constructor(private accountManager: ClientAccountManagerService,
              private categoryManager: MockCategoryService) {}

  addProducts() {
  }
}
