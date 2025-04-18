import { TestBed } from '@angular/core/testing';

import { SpecialiteFonctionService } from './specialite-fonction.service';

describe('SpecialiteFonctionService', () => {
  let service: SpecialiteFonctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialiteFonctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
