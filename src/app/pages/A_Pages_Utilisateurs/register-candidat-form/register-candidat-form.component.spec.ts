import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCandidatFormComponent } from './register-candidat-form.component';

describe('RegisterCandidatFormComponent', () => {
  let component: RegisterCandidatFormComponent;
  let fixture: ComponentFixture<RegisterCandidatFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterCandidatFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCandidatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
