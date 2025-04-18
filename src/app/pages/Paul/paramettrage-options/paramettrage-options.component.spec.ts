import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamettrageOptionsComponent } from './paramettrage-options.component';

describe('ParamettrageOptionsComponent', () => {
  let component: ParamettrageOptionsComponent;
  let fixture: ComponentFixture<ParamettrageOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamettrageOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamettrageOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
