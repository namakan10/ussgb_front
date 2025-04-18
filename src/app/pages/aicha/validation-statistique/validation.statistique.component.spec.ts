import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationStatistiqueComponent } from './validation.statistique.component';

describe('ImputationComponent', () => {
  let component: ValidationStatistiqueComponent;
  let fixture: ComponentFixture<ValidationStatistiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationStatistiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
