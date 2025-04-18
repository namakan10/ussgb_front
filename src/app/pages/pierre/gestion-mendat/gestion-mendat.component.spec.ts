import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMendatComponent } from './gestion-mendat.component';

describe('GestionMendatComponent', () => {
  let component: GestionMendatComponent;
  let fixture: ComponentFixture<GestionMendatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionMendatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionMendatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
