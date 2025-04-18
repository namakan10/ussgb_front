import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrhCongePermissionComponent } from './grh-conge-permission..component';

describe('CongesComponent', () => {
  let component: GrhCongePermissionComponent;
  let fixture: ComponentFixture<GrhCongePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrhCongePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrhCongePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
