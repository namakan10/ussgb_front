import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEtudiantsNonInscritComponent } from './liste-etudiants-non-inscrit.component';

describe('ListeEtudiantsNonInscritComponent', () => {
  let component: ListeEtudiantsNonInscritComponent;
  let fixture: ComponentFixture<ListeEtudiantsNonInscritComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeEtudiantsNonInscritComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeEtudiantsNonInscritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
