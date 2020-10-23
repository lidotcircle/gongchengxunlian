import { Injectable } from '@angular/core';
import { StaticValue } from '../static-value/static-value.module';
import { ClientAccountManagerService } from './client-account-manager.service';

@Injectable({
  providedIn: 'root'
})
export class MockCategoryService {
  constructor(private accountManager: ClientAccountManagerService) {
  }

  async getAll(): Promise<StaticValue.Category> {
    return await this.accountManager.getCategories();
  }

  async save(): Promise<boolean> {
  }
}

