import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteEnseignantsComponent } from './carte-enseignants.component';

describe('CarteEnseignantsComponent', () => {
  let component: CarteEnseignantsComponent;
  let fixture: ComponentFixture<CarteEnseignantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteEnseignantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteEnseignantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
