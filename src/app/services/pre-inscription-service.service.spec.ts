import { TestBed } from '@angular/core/testing';

import { PreInscriptionServiceService } from './pre-inscription-service.service';

describe('PreInscriptionServiceService', () => {
  let service: PreInscriptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreInscriptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
