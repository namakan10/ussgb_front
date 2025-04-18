import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEtudiantTraitementComponent } from './demande-etudiant-traitement.component';

describe('DemandeEtudiantTraitementComponent', () => {
  let component: DemandeEtudiantTraitementComponent;
  let fixture: ComponentFixture<DemandeEtudiantTraitementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeEtudiantTraitementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeEtudiantTraitementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
