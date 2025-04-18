import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrabsenceComponent } from './grabsence.component';

describe('GrabsenceComponent', () => {
  let component: GrabsenceComponent;
  let fixture: ComponentFixture<GrabsenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrabsenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrabsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
