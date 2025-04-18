import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPreinscriptionComponent } from './form-preinscription.component';

describe('FormPreinscriptionComponent', () => {
  let component: FormPreinscriptionComponent;
  let fixture: ComponentFixture<FormPreinscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPreinscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPreinscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
