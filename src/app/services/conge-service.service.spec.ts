import { TestBed } from '@angular/core/testing';

import { CongeServiceService } from './conge-service.service';

describe('CongeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CongeServiceService = TestBed.get(CongeServiceService);
    expect(service).toBeTruthy();
  });
});
