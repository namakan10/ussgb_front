import { TestBed } from '@angular/core/testing';

import { ConditionPassageService } from './condition-passage.service';

describe('ConditionPassageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConditionPassageService = TestBed.get(ConditionPassageService);
    expect(service).toBeTruthy();
  });
});
