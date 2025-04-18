import { TestBed } from '@angular/core/testing';

import { DemandeEtudiantService } from './demande-etudiant.service';

describe('DemandeEtudiantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemandeEtudiantService = TestBed.get(DemandeEtudiantService);
    expect(service).toBeTruthy();
  });
});
