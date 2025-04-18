import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquesComponent } from './historiques.component';

describe('HistoriquesComponent', () => {
  let component: HistoriquesComponent;
  let fixture: ComponentFixture<HistoriquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
