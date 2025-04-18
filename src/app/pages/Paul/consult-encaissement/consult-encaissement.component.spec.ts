import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultEncaissementComponent } from './consult-encaissement.component';

describe('ConsultEncaissementComponent', () => {
  let component: ConsultEncaissementComponent;
  let fixture: ComponentFixture<ConsultEncaissementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultEncaissementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultEncaissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
