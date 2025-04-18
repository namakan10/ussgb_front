import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierStatistiqueComponent } from './courrier.statistique.component';

describe('ImputationComponent', () => {
  let component: CourrierStatistiqueComponent;
  let fixture: ComponentFixture<CourrierStatistiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourrierStatistiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourrierStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
