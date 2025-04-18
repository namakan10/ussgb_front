import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPersonnelAdminComponent } from './gestion-personnel-admin.component';

describe('GestionPersonnelAdminComponent', () => {
  let component: GestionPersonnelAdminComponent;
  let fixture: ComponentFixture<GestionPersonnelAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPersonnelAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPersonnelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
