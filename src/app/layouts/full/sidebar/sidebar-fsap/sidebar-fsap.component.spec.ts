import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFsapComponent } from './sidebar-fsap.component';

describe('SidebarFsapComponent', () => {
  let component: SidebarFsapComponent;
  let fixture: ComponentFixture<SidebarFsapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarFsapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarFsapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
