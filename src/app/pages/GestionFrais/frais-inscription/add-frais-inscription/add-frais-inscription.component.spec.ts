import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFraisInscriptionComponent } from './add-frais-inscription.component';

describe('AddFraisInscriptionComponent', () => {
  let component: AddFraisInscriptionComponent;
  let fixture: ComponentFixture<AddFraisInscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFraisInscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFraisInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
