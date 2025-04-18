import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeTransfertExterneComponent } from './demande-transfert-externe.component';

describe('DemandeTransfertExterneComponent', () => {
  let component: DemandeTransfertExterneComponent;
  let fixture: ComponentFixture<DemandeTransfertExterneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeTransfertExterneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeTransfertExterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
