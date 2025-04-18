import { TestBed } from '@angular/core/testing';

import { InformationsPortailService } from './informations-portail.service';

describe('InformationsPortailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InformationsPortailService = TestBed.get(InformationsPortailService);
    expect(service).toBeTruthy();
  });
});
