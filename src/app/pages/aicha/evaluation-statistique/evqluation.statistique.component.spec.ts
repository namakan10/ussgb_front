import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationStatistiqueComponent } from './evaluation.statistique.component';

describe('ImputationComponent', () => {
  let component: EvaluationStatistiqueComponent;
  let fixture: ComponentFixture<EvaluationStatistiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationStatistiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
