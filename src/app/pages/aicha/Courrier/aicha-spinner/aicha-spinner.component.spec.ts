import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AichaSpinnerComponent } from './aicha-spinner.component';

describe('CourrierComponent', () => {
  let component: AichaSpinnerComponent;
  let fixture: ComponentFixture<AichaSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AichaSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AichaSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
