import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvEnseignantComponent } from './cv-enseignant.component';

describe('CvEnseignantComponent', () => {
  let component: CvEnseignantComponent;
  let fixture: ComponentFixture<CvEnseignantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvEnseignantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvEnseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
