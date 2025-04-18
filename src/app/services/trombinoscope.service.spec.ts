import { TestBed } from '@angular/core/testing';

import { TrombinoscopeService } from './trombinoscope.service';

describe('TrombinoscopeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrombinoscopeService = TestBed.get(TrombinoscopeService);
    expect(service).toBeTruthy();
  });
});
