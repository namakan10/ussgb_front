import { TestBed } from '@angular/core/testing';

import { FraisScolariteService } from './frais-scolarite.service';

describe('FraisScolariteService', () => {
  let service: FraisScolariteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FraisScolariteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
