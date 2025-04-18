import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatInfosComponent } from './candidat-infos.component';

describe('CandidatInfosComponent', () => {
  let component: CandidatInfosComponent;
  let fixture: ComponentFixture<CandidatInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
