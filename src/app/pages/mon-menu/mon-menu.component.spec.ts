import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonMenuComponent } from './mon-menu.component';

describe('MonMenuComponent', () => {
  let component: MonMenuComponent;
  let fixture: ComponentFixture<MonMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
