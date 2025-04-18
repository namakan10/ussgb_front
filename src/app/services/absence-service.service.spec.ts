import { TestBed } from '@angular/core/testing';

import { AbsenceServiceService } from './absence-service.service';

describe('AbsenceServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbsenceServiceService = TestBed.get(AbsenceServiceService);
    expect(service).toBeTruthy();
  });
});
