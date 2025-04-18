import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentResetPasswordComponent } from './student-reset-password.component';

describe('ListeEtudiantsComponent', () => {
  let component: StudentResetPasswordComponent;
  let fixture: ComponentFixture<StudentResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
