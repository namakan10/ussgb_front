import { TestBed } from '@angular/core/testing';

import { AffectationServiceService } from './affectation-service.service';

describe('AffectationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AffectationServiceService = TestBed.get(AffectationServiceService);
    expect(service).toBeTruthy();
  });
});
