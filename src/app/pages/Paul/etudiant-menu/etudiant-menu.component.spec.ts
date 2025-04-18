import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantMenuComponent } from './etudiant-menu.component';

describe('EtudiantMenuComponent', () => {
  let component: EtudiantMenuComponent;
  let fixture: ComponentFixture<EtudiantMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudiantMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
