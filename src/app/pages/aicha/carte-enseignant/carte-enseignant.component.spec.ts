import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteEnseignantComponent } from './carte-enseignant.component';

describe('EnseignantComponent', () => {
  let component: CarteEnseignantComponent;
  let fixture: ComponentFixture<CarteEnseignantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteEnseignantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteEnseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
