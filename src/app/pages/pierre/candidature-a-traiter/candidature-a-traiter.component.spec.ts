import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatureATraiterComponent } from './candidature-a-traiter.component';

describe('CandidatureATraiterComponent', () => {
  let component: CandidatureATraiterComponent;
  let fixture: ComponentFixture<CandidatureATraiterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatureATraiterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatureATraiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
