import { TestBed } from '@angular/core/testing';

import { OffresService } from './offres.service';

describe('OffresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OffresService = TestBed.get(OffresService);
    expect(service).toBeTruthy();
  });
});
