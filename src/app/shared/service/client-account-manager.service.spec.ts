import { TestBed } from '@angular/core/testing';

import { ClientAccountManagerService } from './client-account-manager.service';

describe('ClientAccountManagerService', () => {
  let service: ClientAccountManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientAccountManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
