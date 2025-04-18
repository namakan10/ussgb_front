import { TestBed } from '@angular/core/testing';

import { PersonnelAdminService } from './personnel-admin.service';

describe('PersonnelAdminService', () => {
  let service: PersonnelAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonnelAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
