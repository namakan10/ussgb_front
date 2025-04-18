import { TestBed } from '@angular/core/testing';

import { ParametreService } from './parametre.service';

describe('ParametreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametreService = TestBed.get(ParametreService);
    expect(service).toBeTruthy();
  });
});
