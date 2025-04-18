import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelAdminListComponent } from './personnel-admin-list.component';

describe('PersonnelAdminComponent', () => {
  let component: PersonnelAdminListComponent;
  let fixture: ComponentFixture<PersonnelAdminListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelAdminListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
