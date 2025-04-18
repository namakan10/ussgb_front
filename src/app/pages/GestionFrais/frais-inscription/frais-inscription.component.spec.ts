import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FraisInscriptionComponent } from './frais-inscription.component';

describe('FraisInscriptionComponent', () => {
  let component: FraisInscriptionComponent;
  let fixture: ComponentFixture<FraisInscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraisInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FraisInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
