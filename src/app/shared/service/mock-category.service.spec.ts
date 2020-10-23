import { TestBed } from '@angular/core/testing';

import { MockCategoryService } from './mock-category.service';

describe('MockCategoryService', () => {
  let service: MockCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
