import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditePersonnelAdminComponent } from './edite-personnel-admin.component';

describe('EditePersonnelAdminComponent', () => {
  let component: EditePersonnelAdminComponent;
  let fixture: ComponentFixture<EditePersonnelAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditePersonnelAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditePersonnelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
