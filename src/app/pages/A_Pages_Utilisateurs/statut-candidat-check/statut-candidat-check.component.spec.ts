import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutCandidatCheckComponent } from './statut-candidat-check.component';

describe('StatutCandidatCheckComponent', () => {
  let component: StatutCandidatCheckComponent;
  let fixture: ComponentFixture<StatutCandidatCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatutCandidatCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatutCandidatCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
