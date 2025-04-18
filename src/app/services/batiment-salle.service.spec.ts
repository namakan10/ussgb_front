import { TestBed } from '@angular/core/testing';

import { BatimentSalleService } from './batiment-salle.service';

describe('BatimentSalleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BatimentSalleService = TestBed.get(BatimentSalleService);
    expect(service).toBeTruthy();
  });
});
