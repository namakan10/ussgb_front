import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifFraisInscriptionComponent } from './modif-frais-inscription.component';

describe('ModifFraisInscriptionComponent', () => {
  let component: ModifFraisInscriptionComponent;
  let fixture: ComponentFixture<ModifFraisInscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifFraisInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifFraisInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
