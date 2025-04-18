import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImputationComponent } from './imputation.component';

describe('ImputationComponent', () => {
  let component: ImputationComponent;
  let fixture: ComponentFixture<ImputationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImputationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
