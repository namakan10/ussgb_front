import { TestBed } from '@angular/core/testing';

import { CarriereServiceService } from './carriere-service.service';

describe('CarriereServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarriereServiceService = TestBed.get(CarriereServiceService);
    expect(service).toBeTruthy();
  });
});
