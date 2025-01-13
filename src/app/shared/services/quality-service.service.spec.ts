import { TestBed } from '@angular/core/testing';

import { QualityServiceService } from './quality-service.service';

describe('QualityServiceService', () => {
  let service: QualityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
