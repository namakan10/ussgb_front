import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdepartementsComponent } from './gdepartements.component';

describe('GserviceComponent', () => {
  let component: GdepartementsComponent;
  let fixture: ComponentFixture<GdepartementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdepartementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdepartementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
