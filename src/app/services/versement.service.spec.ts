import { TestBed } from '@angular/core/testing';

import { VersementService } from './versement.service';

describe('VersementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VersementService = TestBed.get(VersementService);
    expect(service).toBeTruthy();
  });
});
