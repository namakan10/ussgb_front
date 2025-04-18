import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReclamationComponent } from './gestion-reclamation.component';

describe('GestionReclamationComponent', () => {
  let component: GestionReclamationComponent;
  let fixture: ComponentFixture<GestionReclamationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionReclamationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
