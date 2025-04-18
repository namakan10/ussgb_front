import { TestBed } from '@angular/core/testing';

import { GestionFraisService } from './gestion-frais.service';

describe('GestionFraisService', () => {
  let service: GestionFraisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionFraisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
