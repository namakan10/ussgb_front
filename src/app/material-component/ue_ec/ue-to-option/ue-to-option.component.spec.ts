import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UeToOptionComponent } from './ue-to-option.component';

describe('UeToOptionComponent', () => {
  let component: UeToOptionComponent;
  let fixture: ComponentFixture<UeToOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UeToOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UeToOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
