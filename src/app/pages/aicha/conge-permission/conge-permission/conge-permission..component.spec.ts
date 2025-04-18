import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongePermissionComponent } from './conge-permission..component';

describe('CongesComponent', () => {
  let component: CongePermissionComponent;
  let fixture: ComponentFixture<CongePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
