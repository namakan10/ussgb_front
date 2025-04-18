import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartesEtudiantComponent } from './cartes-etudiant.component';

describe('CartesEtudiantComponent', () => {
  let component: CartesEtudiantComponent;
  let fixture: ComponentFixture<CartesEtudiantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartesEtudiantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartesEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
