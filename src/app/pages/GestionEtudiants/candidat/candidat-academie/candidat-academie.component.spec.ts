import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatAcademieComponent } from './candidat-academie.component';

describe('CandidatAcademieComponent', () => {
  let component: CandidatAcademieComponent;
  let fixture: ComponentFixture<CandidatAcademieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatAcademieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatAcademieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
