import { TestBed } from '@angular/core/testing';

import { UesServiceService } from './ues.service';

describe('UesServiceService', () => {
  let service: UesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
