import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEtudiantsComponent } from './demande-etudiants.component';

describe('DemandeEtudiantsComponent', () => {
  let component: DemandeEtudiantsComponent;
  let fixture: ComponentFixture<DemandeEtudiantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeEtudiantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
