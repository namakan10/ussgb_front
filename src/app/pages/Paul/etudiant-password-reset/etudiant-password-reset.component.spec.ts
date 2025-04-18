import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantPasswordResetComponent } from './etudiant-password-reset.component';

describe('EtudiantPasswordResetComponent', () => {
  let component: EtudiantPasswordResetComponent;
  let fixture: ComponentFixture<EtudiantPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudiantPasswordResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
