import { TestBed } from '@angular/core/testing';

import { PassportGuard } from './passport.guard';

describe('PassportGuard', () => {
  let guard: PassportGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PassportGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
