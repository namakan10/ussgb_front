import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelAdminFormComponent } from './personnel-admin-form.component';

describe('AddPersonnelComponent', () => {
  let component: PersonnelAdminFormComponent;
  let fixture: ComponentFixture<PersonnelAdminFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelAdminFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
