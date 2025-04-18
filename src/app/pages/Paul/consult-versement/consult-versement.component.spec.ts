import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultVersementComponent } from './consult-versement.component';

describe('ConsultVersementComponent', () => {
  let component: ConsultVersementComponent;
  let fixture: ComponentFixture<ConsultVersementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultVersementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultVersementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
