import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourriersComponent } from './courriers.component';

describe('CourrierComponent', () => {
  let component: CourriersComponent;
  let fixture: ComponentFixture<CourriersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourriersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
