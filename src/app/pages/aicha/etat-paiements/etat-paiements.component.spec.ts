import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatPaiementsComponent } from './etat-paiements.component';

describe('GestionInscriptionComponent', () => {
  let component: EtatPaiementsComponent;
  let fixture: ComponentFixture<EtatPaiementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtatPaiementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtatPaiementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
