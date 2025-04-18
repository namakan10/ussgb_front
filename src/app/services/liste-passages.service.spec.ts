import { TestBed } from '@angular/core/testing';

import { ListePassagesService } from './liste-passages.service';

describe('ListePassagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListePassagesService = TestBed.get(ListePassagesService);
    expect(service).toBeTruthy();
  });
});
