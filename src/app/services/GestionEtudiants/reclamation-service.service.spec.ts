import { TestBed } from '@angular/core/testing';

import { ReclamationServiceService } from './reclamation-service.service';

describe('ReclamationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReclamationServiceService = TestBed.get(ReclamationServiceService);
    expect(service).toBeTruthy();
  });
});
