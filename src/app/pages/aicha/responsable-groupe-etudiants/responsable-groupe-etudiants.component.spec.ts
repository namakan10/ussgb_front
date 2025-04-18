import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableGroupeEtudiantsComponent } from './responsable-groupe-etudiants.component';

describe('ListeEtudiantsComponent', () => {
  let component: ResponsableGroupeEtudiantsComponent;
  let fixture: ComponentFixture<ResponsableGroupeEtudiantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsableGroupeEtudiantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsableGroupeEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
