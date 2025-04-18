import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlancarriereComponent } from './plancarriere.component';

describe('PlancarriereComponent', () => {
  let component: PlancarriereComponent;
  let fixture: ComponentFixture<PlancarriereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlancarriereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlancarriereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
