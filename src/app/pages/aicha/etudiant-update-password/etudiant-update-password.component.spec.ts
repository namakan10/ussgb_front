import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantUpdatePasswordComponent } from './etudiant-update-password.component';

describe('EtudiantPasswordResetComponent', () => {
  let component: EtudiantUpdatePasswordComponent;
  let fixture: ComponentFixture<EtudiantUpdatePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudiantUpdatePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantUpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
