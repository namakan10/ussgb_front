import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionPassageComponent } from './condition-passage.component';

describe('ConditionPassageComponent', () => {
  let component: ConditionPassageComponent;
  let fixture: ComponentFixture<ConditionPassageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionPassageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionPassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
