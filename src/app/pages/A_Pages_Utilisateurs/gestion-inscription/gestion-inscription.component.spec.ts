import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInscriptionComponent } from './gestion-inscription.component';

describe('GestionInscriptionComponent', () => {
  let component: GestionInscriptionComponent;
  let fixture: ComponentFixture<GestionInscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
