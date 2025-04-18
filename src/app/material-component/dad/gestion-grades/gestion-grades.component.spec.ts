import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGradesComponent } from './gestion-grades.component';

describe('GestionGradesComponent', () => {
  let component: GestionGradesComponent;
  let fixture: ComponentFixture<GestionGradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionGradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
