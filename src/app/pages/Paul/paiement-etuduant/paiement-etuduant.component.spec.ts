import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementEtuduantComponent } from './paiement-etuduant.component';

describe('PaiementEtuduantComponent', () => {
  let component: PaiementEtuduantComponent;
  let fixture: ComponentFixture<PaiementEtuduantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaiementEtuduantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaiementEtuduantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
