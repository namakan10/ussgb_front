import { TestBed } from '@angular/core/testing';

import { HistoriquesService } from './historiques.service';

describe('HistoriquesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoriquesService = TestBed.get(HistoriquesService);
    expect(service).toBeTruthy();
  });
});
