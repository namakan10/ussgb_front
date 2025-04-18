import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelAdminViewComponent } from './personnel-admin-view.component';

describe('AddPersonnelComponent', () => {
  let component: PersonnelAdminViewComponent;
  let fixture: ComponentFixture<PersonnelAdminViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelAdminViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
