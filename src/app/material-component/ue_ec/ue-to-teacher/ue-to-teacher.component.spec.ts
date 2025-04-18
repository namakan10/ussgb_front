import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UeToTeacherComponent } from './ue-to-teacher.component';

describe('UeToTeacherComponent', () => {
  let component: UeToTeacherComponent;
  let fixture: ComponentFixture<UeToTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UeToTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UeToTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
