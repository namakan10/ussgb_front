import { TestBed } from '@angular/core/testing';

import { OuvragesService } from './ouvrages.service';

describe('OuvragesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OuvragesService = TestBed.get(OuvragesService);
    expect(service).toBeTruthy();
  });
});
