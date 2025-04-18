import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCandidatureComponent } from './form-candidature.component';

describe('FormCandidatureComponent', () => {
  let component: FormCandidatureComponent;
  let fixture: ComponentFixture<FormCandidatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCandidatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
