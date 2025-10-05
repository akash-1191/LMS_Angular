import { TestBed } from '@angular/core/testing';

import { LmsservicesService } from './lmsservices.service';

describe('LmsservicesService', () => {
  let service: LmsservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmsservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
